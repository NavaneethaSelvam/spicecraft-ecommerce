
import os
import uuid
import secrets
import hashlib
from datetime import datetime, timedelta, timezone
from decimal import Decimal
import logging
from fastapi.responses import StreamingResponse

import jwt
from dotenv import load_dotenv
from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    Query,
    UploadFile,
    File,
    Form,
)
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import engine, Base, SessionLocal
from models.product import Product
from models.category import Category
from models.user import User
from models.order import Order
from models.order_item import OrderItem

from schemas.product import ProductCreate, ProductUpdate
from schemas.category import CategoryCreate, CategoryUpdate
from schemas.user import UserCreate
from schemas.order import OrderCreate
from models.coupon import Coupon, CouponRedemption
from schemas.coupon import (
    CouponCreate,
    CouponUpdate,
    CouponResponse,
    CouponStatusToggle,
    CouponValidateRequest,
    CouponValidateResponse,
)
from sqlalchemy import text, or_

from security import hash_password, verify_password
from auth import get_current_user, require_admin
from rustfs_storage import (
    upload_product_image,
    upload_media_image,
    get_product_image,
    ALLOWED_TYPES,
)
from models.media_asset import MediaAsset

# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60

if not JWT_SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY is missing. Check backend .env."
    )


# =========================================================
# REQUEST SCHEMAS
# =========================================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class OrderStatusUpdate(BaseModel):
    status: str


# =========================================================
# APP / CORS
# =========================================================

app = FastAPI(title="SpiceCraft Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# DATABASE
# =========================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0 NOT NULL;"))
            conn.commit()
    except Exception as exc:
        logging.warning("Database schema check warning: %s", exc)
    Base.metadata.create_all(bind=engine)

init_db()


# =========================================================
# ACCESS CONTROL
# =========================================================

def require_customer(
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "customer":
        raise HTTPException(
            status_code=403,
            detail="Customer access required",
        )
    return current_user


# =========================================================
# HELPERS
# =========================================================

def create_access_token(user):
    now = datetime.now(timezone.utc)

    return jwt.encode(
        {
            "sub": str(user.id),
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "iat": now,
            "exp": now + timedelta(
                minutes=JWT_EXPIRE_MINUTES
            ),
        },
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def parse_uuid(value: str, label: str = "ID") -> uuid.UUID:
    try:
        return uuid.UUID(str(value))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid {label}",
        )


def order_items_response(db: Session, order_id):
    items = (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order_id)
        .all()
    )

    return [
        {
            "product_id": str(item.product_id)
            if item.product_id else None,
            "product_name": item.product_name,
            "product_image": item.product_image,
            "unit_price": str(item.unit_price),
            "quantity": item.quantity,
            "line_total": str(item.line_total),
        }
        for item in items
    ]


def customer_order_response(db: Session, order):
    return {
        "order_number": order.order_number,
        "subtotal": str(order.subtotal),
        "delivery_charge": str(order.delivery_charge),
        "coupon_code": order.coupon_code,
        "discount_amount": str(order.discount_amount or Decimal("0.00")),
        "total_amount": str(order.total_amount),
        "payment_method": order.payment_method,
        "status": order.status,
        "created_at": (
            order.created_at.isoformat()
            if order.created_at else None
        ),
        "items": order_items_response(db, order.id),
    }


def admin_order_response(db: Session, order):
    result = customer_order_response(db, order)

    result.update({
        "customer_name": order.customer_name,
        "email": order.email,
        "phone": order.phone,
        "delivery_address": order.delivery_address,
    })

    return result


def create_tracking_token():
    # Return the raw token only once to the guest.
    # Store only its SHA-256 hash in the database.
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    return token, token_hash


def verify_tracking_token(token: str, stored_hash: str) -> bool:
    supplied_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    return secrets.compare_digest(
        supplied_hash,
        stored_hash,
    )


# =========================================================
# CATEGORY SYNC
# Preserves existing categories and adds missing product names.
# =========================================================

def sync_product_categories():
    with SessionLocal() as db:
        try:
            existing_names = {
                name.strip().casefold()
                for (name,) in db.query(Category.name).all()
                if name and name.strip()
            }

            product_names = (
                db.query(Product.name)
                .filter(Product.name.isnot(None))
                .distinct()
                .all()
            )

            for (product_name,) in product_names:
                if not product_name or not product_name.strip():
                    continue

                category_name = product_name.strip()
                normalized = category_name.casefold()

                if normalized not in existing_names:
                    db.add(Category(
                        name=category_name,
                        is_active=True,
                    ))
                    existing_names.add(normalized)

            db.commit()

        except Exception:
            db.rollback()
            raise


sync_product_categories()


# =========================================================
# HOME / DATABASE TEST
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to SpiceCraft Backend API"
    }


@app.get("/db-test")
def database_test():
    try:
        with engine.connect():
            return {
                "status": "success",
                "message": "PostgreSQL database connected successfully!",
            }
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Database connection failed",
        )


# =========================================================
# ADMIN LOGIN
# =========================================================

@app.post("/admin/login")
def admin_login(login_data: LoginRequest):
    email = str(login_data.email).lower()

    with SessionLocal() as db:
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if (
            not user
            or not user.is_active
            or user.role != "admin"
            or not verify_password(
                login_data.password,
                user.hashed_password,
            )
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid admin email or password",
            )

        return {
            "message": "Admin login successful",
            "access_token": create_access_token(user),
            "token_type": "bearer",
            "expires_in": JWT_EXPIRE_MINUTES * 60,
            "admin": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role,
            },
        }


# =========================================================
# CUSTOMER REGISTER / LOGIN
# =========================================================

@app.post("/register", status_code=201)
def register_user(user_data: UserCreate):
    email = str(user_data.email).lower()

    with SessionLocal() as db:
        if db.query(User).filter(
            User.email == email
        ).first():
            raise HTTPException(
                status_code=409,
                detail="Email already registered",
            )

        new_user = User(
            name=user_data.name,
            email=email,
            hashed_password=hash_password(
                user_data.password
            ),
            role="customer",
            is_active=True,
        )

        db.add(new_user)

        try:
            db.commit()
            db.refresh(new_user)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=409,
                detail="Email already registered",
            )

        return {
            "message": "User registered successfully",
            "user_id": str(new_user.id),
            "name": new_user.name,
            "email": new_user.email,
        }


@app.post("/login")
def customer_login(login_data: LoginRequest):
    email = str(login_data.email).lower()

    with SessionLocal() as db:
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if (
            not user
            or not user.is_active
            or user.role != "customer"
            or not verify_password(
                login_data.password,
                user.hashed_password,
            )
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid customer email or password",
            )

        return {
            "message": "Customer login successful",
            "access_token": create_access_token(user),
            "token_type": "bearer",
            "expires_in": JWT_EXPIRE_MINUTES * 60,
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role,
            },
        }


# =========================================================
# PRODUCT IMAGE STORAGE — RUSTFS
# =========================================================

MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024

ALLOWED_IMAGE_EXTENSIONS = {
    "image/jpeg": {".jpg", ".jpeg"},
    "image/png": {".png"},
    "image/webp": {".webp"},
}


@app.post("/admin/products/upload-image")
async def upload_product_image_route(
    file: UploadFile = File(...),
    admin=Depends(require_admin),
):
    import logging

    filename = file.filename or ""
    content_type = (file.content_type or "").lower()
    extension = os.path.splitext(filename)[1].lower()

    if content_type not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail="Only JPG, PNG, and WEBP images are supported.",
        )

    if extension not in ALLOWED_IMAGE_EXTENSIONS[content_type]:
        raise HTTPException(
            status_code=415,
            detail="Image extension does not match its content type.",
        )

    try:
        content = await file.read(MAX_PRODUCT_IMAGE_BYTES + 1)
    finally:
        await file.close()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Please select an image.",
        )

    if len(content) > MAX_PRODUCT_IMAGE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Image size must not exceed 5 MB.",
        )

    valid_signatures = {
        "image/jpeg": content.startswith(b"\xff\xd8\xff"),
        "image/png": content.startswith(b"\x89PNG\r\n\x1a\n"),
        "image/webp": (
            len(content) >= 12
            and content[:4] == b"RIFF"
            and content[8:12] == b"WEBP"
        ),
    }

    if not valid_signatures[content_type]:
        raise HTTPException(
            status_code=415,
            detail="The selected file is not a valid supported image.",
        )

    try:
        object_key = upload_product_image(
            content=content,
            content_type=content_type,
            original_filename=filename,
        )
    except Exception as exc:
        logging.exception("RustFS product image upload failed")
        raise HTTPException(
            status_code=502,
            detail="Image storage failed. Check backend terminal logs.",
        ) from exc

    api_base_url = os.getenv(
        "PUBLIC_API_BASE_URL",
        "http://127.0.0.1:8000",
    ).rstrip("/")

    return {
        "message": "Image uploaded successfully",
        "image": object_key,
        "image_url": f"{api_base_url}/product-images/{object_key}",
    }



@app.get("/product-images/{object_key:path}")
def serve_product_image(object_key: str):
    allowed_prefixes = (
        "products/",
        "hero/",
        "categories/",
        "dishes/",
        "recipes/",
        "blog/",
        "about/",
        "banners/",
        "trust/",
    )

    if (
        not object_key.startswith(allowed_prefixes)
        or ".." in object_key
        or "\\" in object_key
    ):
        raise HTTPException(
            status_code=404,
            detail="Image not found",
        )

    try:
        stored_object = get_product_image(object_key)

        return StreamingResponse(
            stored_object["Body"],
            media_type=stored_object.get(
                "ContentType", "application/octet-stream"
            ),
        )

    except Exception:
        logging.exception(
            "Failed to serve RustFS image: %s",
            object_key,
        )
        raise HTTPException(
            status_code=404,
            detail="Image not found",
        )

    return Response(
        content=content,
        media_type=content_type,
        headers={
            "Cache-Control": "public, max-age=86400",
            "X-Content-Type-Options": "nosniff",
        },
    )
# =========================================================
# PRODUCTS
# =========================================================

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@app.get("/products/{product_id}")
def get_product(
    product_id: str,
    db: Session = Depends(get_db),
):
    product = db.get(
        Product,
        parse_uuid(product_id, "product ID"),
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product


@app.post("/products", status_code=201)
def create_product(
    product_data: ProductCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    new_product = Product(
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        category=product_data.category,
        image=product_data.image,
        stock=product_data.stock,
        is_active=product_data.is_active,
    )

    db.add(new_product)

    try:
        db.commit()
        db.refresh(new_product)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Unable to create product due to a database conflict",
        )

    return new_product


@app.put("/products/{product_id}")
def update_product(
    product_id: str,
    product_data: ProductUpdate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    product = db.get(
        Product,
        parse_uuid(product_id, "product ID"),
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    for key, value in product_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(product, key, value)

    try:
        db.commit()
        db.refresh(product)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Unable to update product",
        )

    return product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    product = db.get(
        Product,
        parse_uuid(product_id, "product ID"),
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }


# =========================================================
# CATEGORIES
# =========================================================

@app.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@app.post("/categories", status_code=201)
def create_category(
    category_data: CategoryCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    new_category = Category(
        name=category_data.name,
        description=category_data.description,
        image=category_data.image,
        is_active=category_data.is_active,
    )

    db.add(new_category)

    try:
        db.commit()
        db.refresh(new_category)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Category name already exists",
        )

    return new_category


@app.put("/categories/{category_id}")
def update_category(
    category_id: str,
    category_data: CategoryUpdate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    category = db.get(
        Category,
        parse_uuid(category_id, "category ID"),
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    for key, value in category_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(category, key, value)

    try:
        db.commit()
        db.refresh(category)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Category name already exists",
        )

    return category


@app.delete("/categories/{category_id}")
def delete_category(
    category_id: str,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    category = db.get(
        Category,
        parse_uuid(category_id, "category ID"),
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    db.delete(category)
    db.commit()

    return {
        "message": "Category deleted successfully"
    }


# =========================================================
# GUEST CHECKOUT
# Guest orders use user_id=None.
# Prices and stock are calculated/checked on the server.
# =========================================================

def validate_and_apply_coupon(
    db: Session,
    code: str,
    subtotal: Decimal,
    customer_email: str | None = None,
    customer_phone: str | None = None,
    for_order: bool = False,
) -> tuple[Coupon, Decimal]:
    clean_code = (code or "").strip().upper()
    if not clean_code:
        raise HTTPException(
            status_code=400,
            detail="Coupon code cannot be empty.",
        )

    query = db.query(Coupon).filter(Coupon.code == clean_code)
    if for_order:
        query = query.with_for_update()

    coupon = query.first()
    if not coupon:
        raise HTTPException(
            status_code=404,
            detail=f"Coupon code '{clean_code}' is invalid or does not exist.",
        )

    if not coupon.is_active:
        raise HTTPException(
            status_code=400,
            detail=f"Coupon '{coupon.code}' is currently inactive.",
        )

    now = datetime.now(timezone.utc)

    if coupon.start_date:
        start = coupon.start_date
        if start.tzinfo is None:
            start = start.replace(tzinfo=timezone.utc)
        if now < start:
            raise HTTPException(
                status_code=400,
                detail=f"Coupon '{coupon.code}' is not active yet.",
            )

    if coupon.expiry_date:
        expiry = coupon.expiry_date
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)
        if now > expiry:
            raise HTTPException(
                status_code=400,
                detail=f"Coupon '{coupon.code}' has expired.",
            )

    min_order = Decimal(str(coupon.min_order_amount or 0))
    if subtotal < min_order:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum order amount of ₹{min_order:.2f} is required for coupon '{coupon.code}'. Current subtotal: ₹{subtotal:.2f}.",
        )

    if coupon.total_usage_limit is not None and (coupon.times_used or 0) >= coupon.total_usage_limit:
        raise HTTPException(
            status_code=400,
            detail=f"Coupon '{coupon.code}' has reached its total usage limit.",
        )

    # Check per-customer usage limit across prior active redemptions
    if coupon.max_usage_per_customer is not None and coupon.max_usage_per_customer > 0:
        norm_email = str(customer_email).strip().lower() if customer_email else None
        norm_phone = "".join(filter(str.isdigit, str(customer_phone))) if customer_phone else None

        if norm_email or norm_phone:
            conditions = []
            if norm_email:
                conditions.append(CouponRedemption.customer_email == norm_email)
            if norm_phone:
                conditions.append(CouponRedemption.customer_phone == norm_phone)

            redemption_count = (
                db.query(CouponRedemption)
                .filter(
                    CouponRedemption.coupon_id == coupon.id,
                    CouponRedemption.status == "active",
                    or_(*conditions),
                )
                .count()
            )

            if redemption_count >= coupon.max_usage_per_customer:
                raise HTTPException(
                    status_code=400,
                    detail=f"You have already used coupon '{coupon.code}' the maximum allowed number of times ({coupon.max_usage_per_customer}).",
                )

    # Calculate discount amount
    subtotal_dec = Decimal(str(subtotal)).quantize(Decimal("0.01"))
    val = Decimal(str(coupon.discount_value))

    if coupon.discount_type == "percentage":
        discount = (subtotal_dec * (val / Decimal("100"))).quantize(Decimal("0.01"))
        if coupon.max_discount_amount is not None and coupon.max_discount_amount > 0:
            max_disc = Decimal(str(coupon.max_discount_amount)).quantize(Decimal("0.01"))
            discount = min(discount, max_disc)
    else:  # fixed
        discount = min(val, subtotal_dec)

    discount = max(Decimal("0.00"), discount)
    return coupon, discount


@app.post("/orders", status_code=201)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
):
    tracking_token, tracking_hash = create_tracking_token()

    try:
        subtotal = Decimal("0.00")
        requested_quantities = {}
        prepared_items = []

        for item in order_data.items:
            product_id = parse_uuid(
                item.product_id,
                "product ID",
            )

            if item.quantity <= 0:
                raise HTTPException(
                    status_code=400,
                    detail="Quantity must be greater than zero",
                )

            requested_quantities[product_id] = (
                requested_quantities.get(product_id, 0)
                + item.quantity
            )

            prepared_items.append(
                (product_id, item.quantity)
            )

        locked_products = {}

        for product_id, quantity in requested_quantities.items():
            product = (
                db.query(Product)
                .filter(Product.id == product_id)
                .with_for_update()
                .first()
            )

            if not product or not product.is_active:
                raise HTTPException(
                    status_code=404,
                    detail="One or more products are unavailable",
                )

            if (
                product.stock is None
                or product.stock < quantity
            ):
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}",
                )

            locked_products[product_id] = product

        for product_id, quantity in prepared_items:
            product = locked_products[product_id]

            unit_price = Decimal(
                str(product.price)
            ).quantize(Decimal("0.01"))

            subtotal += unit_price * quantity

        delivery_charge = (
            Decimal("0.00")
            if subtotal >= Decimal("499.00")
            else Decimal("40.00")
        )

        # Validate & apply coupon server-side with DB locking
        applied_coupon = None
        discount_amount = Decimal("0.00")
        if order_data.coupon_code and order_data.coupon_code.strip():
            applied_coupon, discount_amount = validate_and_apply_coupon(
                db=db,
                code=order_data.coupon_code,
                subtotal=subtotal,
                customer_email=str(order_data.email).lower(),
                customer_phone=order_data.phone,
                for_order=True,
            )

        total_amount = max(Decimal("0.00"), subtotal - discount_amount + delivery_charge)
        order_number = (
            f"SC{secrets.token_hex(8).upper()}"
        )

        new_order = Order(
            order_number=order_number,
            user_id=None,
            tracking_token_hash=tracking_hash,
            customer_name=order_data.customer_name,
            email=str(order_data.email).lower(),
            phone=order_data.phone,
            delivery_address=order_data.delivery_address,
            subtotal=subtotal,
            delivery_charge=delivery_charge,
            coupon_code=applied_coupon.code if applied_coupon else None,
            discount_amount=discount_amount,
            total_amount=total_amount,
            payment_method=order_data.payment_method,
            status="Order Placed",
        )

        db.add(new_order)
        db.flush()

        for product_id, quantity in prepared_items:
            product = locked_products[product_id]

            unit_price = Decimal(
                str(product.price)
            ).quantize(Decimal("0.01"))

            db.add(OrderItem(
                order_id=new_order.id,
                product_id=str(product.id),
                product_name=product.name,
                product_image=product.image,
                unit_price=unit_price,
                quantity=quantity,
                line_total=unit_price * quantity,
            ))

        for product_id, quantity in requested_quantities.items():
            locked_products[product_id].stock -= quantity

        if applied_coupon:
            applied_coupon.times_used = (applied_coupon.times_used or 0) + 1
            redemption = CouponRedemption(
                coupon_id=applied_coupon.id,
                order_id=new_order.id,
                customer_email=str(order_data.email).lower(),
                customer_phone="".join(filter(str.isdigit, str(order_data.phone))),
                discount_amount=discount_amount,
                status="active",
            )
            db.add(redemption)

        db.commit()
        db.refresh(new_order)

        # The raw tracking token is returned once.
        # Save it in the frontend tracking link immediately.
        return {
            "message": "Order placed successfully",
            "order_number": new_order.order_number,
            "tracking_token": tracking_token,
            "status": new_order.status,
            "created_at": (
                new_order.created_at.isoformat()
                if new_order.created_at else None
            ),
            "subtotal": str(new_order.subtotal),
            "delivery_charge": str(new_order.delivery_charge),
            "coupon_code": new_order.coupon_code,
            "discount_amount": str(new_order.discount_amount or Decimal("0.00")),
            "total_amount": str(new_order.total_amount),
            "payment_method": new_order.payment_method,
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to place order. Please try again.",
        )


# =========================================================
# GUEST ORDER TRACKING
# Requires both order number and the private token.
# Does not expose email, phone, or delivery address.
# =========================================================


# =========================================================
# GUEST ORDER TRACKING
# Requires order number + private tracking token.
# =========================================================

@app.get("/track/{order_number}")
def track_order(
    order_number: str,
    token: str = Query(
        ...,
        min_length=20,
        max_length=200,
    ),
    db: Session = Depends(get_db),
):
    clean_order_number = order_number.strip()
    clean_token = token.strip()

    order = (
        db.query(Order)
        .filter(
            Order.order_number == clean_order_number
        )
        .first()
    )

    # Use the same error for an invalid order or token.
    if (
        not order
        or not order.tracking_token_hash
        or not verify_tracking_token(
            clean_token,
            order.tracking_token_hash,
        )
    ):
        raise HTTPException(
            status_code=404,
            detail=(
                "Order not found or tracking token is invalid."
            ),
        )

    # Return only safe order details to guest customers.
    return customer_order_response(db, order)

# =========================================================
# CUSTOMER ACCOUNT ORDERS
# Only the authenticated customer's orders are returned.
# Guest orders are intentionally excluded.
# =========================================================

@app.get("/orders/my")
def get_my_orders(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):
    user_id = parse_uuid(
        current_user["id"],
        "user ID",
    )

    orders = (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return [
        customer_order_response(db, order)
        for order in orders
    ]


@app.get("/orders/{order_number}")
def get_order(
    order_number: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.order_number == order_number)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    # Only the order owner or an admin can access it.
    user_id = str(current_user.get("id", ""))

    if (
        str(order.user_id) != user_id
        and current_user.get("role") != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    if current_user.get("role") == "admin":
        return admin_order_response(db, order)

    return customer_order_response(db, order)


# =========================================================
# ADMIN: ALL ORDERS
# =========================================================

@app.get("/admin/orders")
def get_all_orders(
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .all()
    )

    return [
        admin_order_response(db, order)
        for order in orders
    ]


# =========================================================
# ADMIN: UPDATE ORDER STATUS
# =========================================================


# =========================================================
# ADMIN: UPDATE ORDER STATUS
# =========================================================

@app.patch("/admin/orders/{order_number}/status")
def update_order_status(
    order_number: str,
    status_data: OrderStatusUpdate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    allowed_statuses = {
        "Order Placed",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
    }

    status = status_data.status

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid order status",
                "allowed_statuses": sorted(allowed_statuses),
            },
        )

    try:
        order = (
            db.query(Order)
            .filter(Order.order_number == order_number)
            .with_for_update()
            .first()
        )

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found",
            )

        if order.status == "Delivered" and status != "Delivered":
            raise HTTPException(
                status_code=400,
                detail="Delivered orders cannot be moved to another status",
            )

        if order.status == "Cancelled" and status != "Cancelled":
            raise HTTPException(
                status_code=400,
                detail="Cancelled orders cannot be reopened",
            )

        if status == "Cancelled" and order.status != "Cancelled":
            items = (
                db.query(OrderItem)
                .filter(OrderItem.order_id == order.id)
                .all()
            )

            for item in items:
                if not item.product_id:
                    continue

                try:
                    product_id = uuid.UUID(str(item.product_id))
                except (ValueError, TypeError, AttributeError):
                    continue

                product = (
                    db.query(Product)
                    .filter(Product.id == product_id)
                    .with_for_update()
                    .first()
                )

                if product:
                    product.stock = (product.stock or 0) + item.quantity

            # Cancelled Order Coupon Rule:
            # When an order is cancelled, any redeemed coupon usage is reversed:
            # the coupon times_used is decremented, and the redemption record is marked 'cancelled'
            # so the customer's per-customer quota is safely restored.
            if order.coupon_code and (order.discount_amount or 0) > 0:
                redemption = (
                    db.query(CouponRedemption)
                    .filter(
                        CouponRedemption.order_id == order.id,
                        CouponRedemption.status == "active",
                    )
                    .first()
                )
                if redemption:
                    redemption.status = "cancelled"
                    coupon = (
                        db.query(Coupon)
                        .filter(Coupon.code == order.coupon_code)
                        .with_for_update()
                        .first()
                    )
                    if coupon and coupon.times_used > 0:
                        coupon.times_used -= 1

        order.status = status

        db.commit()
        db.refresh(order)

        return {
            "message": "Order status updated successfully",
            "order_number": order.order_number,
            "status": order.status,
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to update order status",
        )


# =========================================================
# ADMIN-ONLY DEBUG ENDPOINT
# =========================================================

@app.get("/debug/products")
def debug_products(
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    products = db.query(Product).all()

    return [
        {
            "id": str(product.id),
            "name": product.name,
            "price": str(product.price),
            "is_active": product.is_active,
        }
        for product in products
    ]


# =========================================================
# MEDIA MANAGER
# =========================================================

MAX_MEDIA_IMAGE_BYTES = 5 * 1024 * 1024

MEDIA_SECTIONS = {
    "hero",
    "category",
    "product",
    "recipe",
    "blog",
    "about",
    "banner",
    "trust",
    "dish",
}

def media_asset_response(asset):
    return {
        "id": str(asset.id),
        "title": asset.title,
        "section": asset.section,
        "object_key": asset.object_key,
        "image_url": asset.image_url,
        "alt_text": asset.alt_text,
        "is_active": asset.is_active,
        "created_at": (
            asset.created_at.isoformat()
            if asset.created_at else None
        ),
    }


@app.get("/media")
def get_media(
    section: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(MediaAsset).filter(
        MediaAsset.is_active.is_(True)
    )

    if section:
        query = query.filter(
            MediaAsset.section == section
        )

    assets = query.order_by(
        MediaAsset.created_at.asc()
    ).all()

    return [media_asset_response(a) for a in assets]


@app.get("/media/status")
def get_product_media_status(
    section: str = "product",
    db: Session = Depends(get_db),
):
    """Return media visibility status so the Shop can hide images only.

    Product records remain active; this endpoint only reports media visibility.
    """
    if section != "product":
        raise HTTPException(
            status_code=400,
            detail="Only product media status is available here",
        )

    assets = (
        db.query(MediaAsset)
        .filter(MediaAsset.section == "product")
        .order_by(MediaAsset.created_at.asc())
        .all()
    )
    return [media_asset_response(asset) for asset in assets]


@app.get("/admin/media")
def admin_get_media(
    section: str | None = None,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(MediaAsset)

    if section:
        query = query.filter(
            MediaAsset.section == section
        )

    assets = query.order_by(
        MediaAsset.created_at.desc()
    ).all()

    return [media_asset_response(a) for a in assets]


@app.post("/admin/media/upload", status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    section: str = Form(...),
    title: str = Form(...),
    alt_text: str = Form(""),
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    import logging

    section = section.strip().lower()
    title = title.strip()

    if section not in MEDIA_SECTIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid media section",
        )

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Title is required",
        )

    filename = file.filename or ""
    content_type = (file.content_type or "").lower()
    extension = os.path.splitext(filename)[1].lower()

    allowed_extensions = {
        "image/jpeg": {".jpg", ".jpeg"},
        "image/png": {".png"},
        "image/webp": {".webp"},
    }

    if content_type not in allowed_extensions:
        raise HTTPException(
            status_code=415,
            detail="Only JPG, PNG, and WEBP images are supported",
        )

    if extension not in allowed_extensions[content_type]:
        raise HTTPException(
            status_code=415,
            detail="Image extension does not match content type",
        )

    try:
        content = await file.read(
            MAX_MEDIA_IMAGE_BYTES + 1
        )
    finally:
        await file.close()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Please select an image",
        )

    if len(content) > MAX_MEDIA_IMAGE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Image size must not exceed 5 MB",
        )

    valid_signatures = {
        "image/jpeg": content.startswith(b"\xff\xd8\xff"),
        "image/png": content.startswith(
            b"\x89PNG\r\n\x1a\n"
        ),
        "image/webp": (
            len(content) >= 12
            and content[:4] == b"RIFF"
            and content[8:12] == b"WEBP"
        ),
    }

    if not valid_signatures[content_type]:
        raise HTTPException(
            status_code=415,
            detail="Invalid image file",
        )

    try:
        new_object_key = upload_media_image(
            content=content,
            content_type=content_type,
            original_filename=filename,
            section=section,
        )
    except Exception as exc:
        logging.exception("RustFS media upload failed")
        raise HTTPException(
            status_code=502,
            detail="Image storage failed",
        ) from exc

    api_base_url = os.getenv(
        "PUBLIC_API_BASE_URL",
        "http://127.0.0.1:8000",
    ).rstrip("/")

    asset = MediaAsset(
        title=title,
        section=section,
        object_key=new_object_key,
        image_url=(
            f"{api_base_url}/product-images/{new_object_key}"
        ),
        alt_text=alt_text.strip() or None,
        is_active=True,
    )
    try:
        db.add(asset)
        db.commit()
        db.refresh(asset)
    except Exception:
        db.rollback()
        logging.exception(
            "Media metadata database insert failed"
        )
        # The uploaded RustFS object may remain orphaned.
        raise HTTPException(
            status_code=500,
            detail="Image uploaded, but saving media metadata failed",
        )

    return media_asset_response(asset)


@app.patch("/admin/media/{asset_id}")
async def update_media(
    asset_id: str,
    title: str | None = Query(default=None),
    alt_text: str | None = Query(default=None),
    section: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    form_title: str | None = Form(default=None, alias="title"),
    form_alt_text: str | None = Form(default=None, alias="alt_text"),
    form_section: str | None = Form(default=None, alias="section"),
    form_is_active: bool | None = Form(default=None, alias="is_active"),
    file: UploadFile | None = File(default=None),
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    import logging

    asset_uuid = parse_uuid(asset_id, "media ID")
    asset = db.get(MediaAsset, asset_uuid)
    if not asset:
        raise HTTPException(status_code=404, detail="Media asset not found")

    # Accept values from either query parameters or multipart FormData.
    title = form_title if form_title is not None else title
    alt_text = form_alt_text if form_alt_text is not None else alt_text
    section = form_section if form_section is not None else section
    is_active = form_is_active if form_is_active is not None else is_active

    new_title = asset.title
    new_section = asset.section

    if title is not None:
        if not title.strip():
            raise HTTPException(status_code=400, detail="Title cannot be empty")
        new_title = title.strip()

    if section is not None:
        new_section = section.strip().lower()
        if new_section not in MEDIA_SECTIONS:
            raise HTTPException(status_code=400, detail="Invalid media section")

    new_object_key = None
    new_image_url = None

    if file is not None and file.filename:
        filename = file.filename
        content_type = (file.content_type or "").lower().strip()
        valid_extensions = {
            "image/jpeg": {".jpg", ".jpeg"},
            "image/png": {".png"},
            "image/webp": {".webp"},
        }

        if content_type not in ALLOWED_TYPES or content_type not in valid_extensions:
            await file.close()
            raise HTTPException(
                status_code=415,
                detail="Only JPG, PNG, and WEBP images are supported",
            )

        extension = os.path.splitext(filename)[1].lower()
        if extension not in valid_extensions[content_type]:
            await file.close()
            raise HTTPException(
                status_code=415,
                detail="Image extension does not match its content type",
            )

        try:
            content = await file.read(MAX_MEDIA_IMAGE_BYTES + 1)
        finally:
            await file.close()

        if not content:
            raise HTTPException(status_code=400, detail="Replacement image is empty")
        if len(content) > MAX_MEDIA_IMAGE_BYTES:
            raise HTTPException(status_code=413, detail="Image size must not exceed 5 MB")

        valid_signatures = {
            "image/jpeg": content.startswith(b"\xff\xd8\xff"),
            "image/png": content.startswith(b"\x89PNG\r\n\x1a\n"),
            "image/webp": (
                len(content) >= 12
                and content[:4] == b"RIFF"
                and content[8:12] == b"WEBP"
            ),
        }
        if not valid_signatures[content_type]:
            raise HTTPException(status_code=415, detail="Invalid image file")

        try:
            new_object_key = upload_media_image(
                content=content,
                content_type=content_type,
                original_filename=filename,
                section=new_section,
            )
            api_base_url = os.getenv(
                "PUBLIC_API_BASE_URL",
                "http://127.0.0.1:8000",
            ).rstrip("/")
            new_image_url = f"{api_base_url}/product-images/{new_object_key}"
        except Exception as exc:
            logging.exception("RustFS replacement upload failed")
            raise HTTPException(
                status_code=502,
                detail="Replacement upload failed. Check backend logs.",
            ) from exc

    try:
        old_object_key = asset.object_key
        old_image_url = asset.image_url
        old_section = asset.section

        asset.title = new_title
        asset.section = new_section
        if alt_text is not None:
            asset.alt_text = alt_text.strip() or None
        if is_active is not None:
            asset.is_active = is_active

        if new_object_key is not None:
            asset.object_key = new_object_key
            asset.image_url = new_image_url

            # Keep product records in sync when their image references this asset.
            if old_section == "product":
                products = db.query(Product).all()
                for product in products:
                    current_image = (product.image or "").strip()
                    if current_image in {old_object_key, old_image_url}:
                        product.image = new_image_url

        db.commit()
        db.refresh(asset)
        return {
            "message": "Media updated successfully",
            "asset": media_asset_response(asset),
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        logging.exception("Media database update failed")
        raise HTTPException(
            status_code=500,
            detail="Unable to update media asset",
        ) from exc


@app.delete("/admin/media/{asset_id}")
def delete_media_metadata(
    asset_id: str,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    asset_uuid = parse_uuid(asset_id, "media ID")
    asset = db.get(MediaAsset, asset_uuid)

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Media asset not found",
        )

    # Delete database metadata only.
    # RustFS object deletion is not implemented here.
    db.delete(asset)
    db.commit()

    return {
        "message": "Media metadata deleted successfully"
    }

# =========================================================
# PUBLIC: VALIDATE COUPON AT CHECKOUT
# =========================================================

@app.post("/coupons/validate", response_model=CouponValidateResponse)
def validate_coupon_for_checkout(
    payload: CouponValidateRequest,
    db: Session = Depends(get_db),
):
    subtotal = Decimal(str(payload.subtotal)).quantize(Decimal("0.01"))
    coupon, discount_amount = validate_and_apply_coupon(
        db=db,
        code=payload.code,
        subtotal=subtotal,
        customer_email=payload.email,
        customer_phone=payload.phone,
        for_order=False,
    )

    return CouponValidateResponse(
        valid=True,
        code=coupon.code,
        discount_type=coupon.discount_type,
        discount_value=coupon.discount_value,
        discount_amount=discount_amount,
        min_order_amount=coupon.min_order_amount,
        max_discount_amount=coupon.max_discount_amount,
        description=coupon.description,
        message=f"Coupon '{coupon.code}' applied! You save ₹{discount_amount:.2f}.",
    )


# =========================================================
# ADMIN: COUPON MANAGEMENT ENDPOINTS
# =========================================================

@app.get("/admin/coupons", response_model=list[CouponResponse])
def get_all_coupons(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query("all"),
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(Coupon)

    if search and search.strip():
        term = f"%{search.strip().upper()}%"
        desc_term = f"%{search.strip()}%"
        query = query.filter(or_(Coupon.code.ilike(term), Coupon.description.ilike(desc_term)))

    now = datetime.now(timezone.utc)
    if status == "active":
        query = query.filter(
            Coupon.is_active == True,
            or_(Coupon.expiry_date == None, Coupon.expiry_date >= now),
        )
    elif status == "inactive":
        query = query.filter(Coupon.is_active == False)
    elif status == "expired":
        query = query.filter(Coupon.expiry_date != None, Coupon.expiry_date < now)

    coupons = query.order_by(Coupon.created_at.desc()).all()
    return coupons


@app.post("/admin/coupons", response_model=CouponResponse, status_code=201)
def create_coupon(
    coupon_data: CouponCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(Coupon).filter(Coupon.code == coupon_data.code).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"A coupon with code '{coupon_data.code}' already exists.",
        )

    if coupon_data.start_date and coupon_data.expiry_date:
        if coupon_data.expiry_date <= coupon_data.start_date:
            raise HTTPException(
                status_code=400,
                detail="Expiry date must be after the start date.",
            )

    new_coupon = Coupon(
        code=coupon_data.code,
        description=coupon_data.description,
        discount_type=coupon_data.discount_type,
        discount_value=coupon_data.discount_value,
        min_order_amount=coupon_data.min_order_amount,
        max_discount_amount=coupon_data.max_discount_amount,
        total_usage_limit=coupon_data.total_usage_limit,
        max_usage_per_customer=coupon_data.max_usage_per_customer,
        start_date=coupon_data.start_date,
        expiry_date=coupon_data.expiry_date,
        is_active=coupon_data.is_active,
    )

    db.add(new_coupon)
    db.commit()
    db.refresh(new_coupon)
    return new_coupon


@app.get("/admin/coupons/{coupon_id}", response_model=CouponResponse)
def get_coupon_by_id(
    coupon_id: str,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    cid = parse_uuid(coupon_id, "coupon ID")
    coupon = db.get(Coupon, cid)
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")
    return coupon


@app.put("/admin/coupons/{coupon_id}", response_model=CouponResponse)
def update_coupon(
    coupon_id: str,
    coupon_data: CouponUpdate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    cid = parse_uuid(coupon_id, "coupon ID")
    coupon = db.get(Coupon, cid)
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")

    if coupon_data.code and coupon_data.code != coupon.code:
        existing = db.query(Coupon).filter(Coupon.code == coupon_data.code).first()
        if existing and existing.id != coupon.id:
            raise HTTPException(
                status_code=400,
                detail=f"A coupon with code '{coupon_data.code}' already exists.",
            )
        coupon.code = coupon_data.code

    update_dict = coupon_data.model_dump(exclude_unset=True)
    if "code" in update_dict:
        del update_dict["code"]

    for field, val in update_dict.items():
        setattr(coupon, field, val)

    if coupon.start_date and coupon.expiry_date:
        if coupon.expiry_date <= coupon.start_date:
            raise HTTPException(
                status_code=400,
                detail="Expiry date must be after start date.",
            )

    db.commit()
    db.refresh(coupon)
    return coupon


@app.patch("/admin/coupons/{coupon_id}/status", response_model=CouponResponse)
def toggle_coupon_status(
    coupon_id: str,
    status_data: CouponStatusToggle,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    cid = parse_uuid(coupon_id, "coupon ID")
    coupon = db.get(Coupon, cid)
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")

    coupon.is_active = status_data.is_active
    db.commit()
    db.refresh(coupon)
    return coupon


@app.delete("/admin/coupons/{coupon_id}")
def delete_coupon(
    coupon_id: str,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    cid = parse_uuid(coupon_id, "coupon ID")
    coupon = db.get(Coupon, cid)
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")

    db.delete(coupon)
    db.commit()
    return {"message": f"Coupon '{coupon.code}' deleted successfully."}
