
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import engine, Base, SessionLocal

from models.product import Product
from models.category import Category
from models.user import User

from schemas.product import ProductCreate, ProductUpdate
from schemas.category import CategoryCreate, CategoryUpdate
from schemas.user import UserCreate

from security import hash_password


# ==========================================
# CREATE FASTAPI APPLICATION
# ==========================================

app = FastAPI(title="SpiceCraft Backend API")


# ==========================================
# CORS CONFIGURATION
# ==========================================

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


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# HOME API
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Welcome to SpiceCraft Backend API"
    }


# ==========================================
# DATABASE TEST API
# ==========================================

@app.get("/db-test")
def database_test():
    try:
        with engine.connect():
            return {
                "status": "success",
                "message": "PostgreSQL database connected successfully!"
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )


# ==========================================
# PRODUCT APIs
# ==========================================

# GET ALL PRODUCTS
@app.get("/products")
def get_products():
    with Session(engine) as session:
        return session.query(Product).all()


# GET ONE PRODUCT
@app.get("/products/{product_id}")
def get_product(product_id: str):
    with Session(engine) as session:
        product = session.get(Product, product_id)

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        return product


# CREATE PRODUCT
@app.post("/products", status_code=201)
def create_product(product: ProductCreate):
    with Session(engine) as session:
        new_product = Product(
            name=product.name,
            description=product.description,
            price=product.price,
            category=product.category,
            image=product.image,
            stock=product.stock,
            is_active=product.is_active
        )

        session.add(new_product)

        try:
            session.commit()
            session.refresh(new_product)
        except IntegrityError:
            session.rollback()
            raise HTTPException(
                status_code=409,
                detail="Unable to create product due to a database conflict"
            )

        return new_product


# UPDATE PRODUCT
@app.put("/products/{product_id}")
def update_product(
    product_id: str,
    product_data: ProductUpdate
):
    with Session(engine) as session:
        product = session.get(Product, product_id)

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        update_data = product_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(product, key, value)

        try:
            session.commit()
            session.refresh(product)
        except IntegrityError:
            session.rollback()
            raise HTTPException(
                status_code=409,
                detail="Unable to update product"
            )

        return product


# DELETE PRODUCT
@app.delete("/products/{product_id}")
def delete_product(product_id: str):
    with Session(engine) as session:
        product = session.get(Product, product_id)

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        session.delete(product)
        session.commit()

        return {
            "message": "Product deleted successfully"
        }


# ==========================================
# CATEGORY APIs
# ==========================================

# CREATE CATEGORY
@app.post("/categories", status_code=201)
def create_category(category_data: CategoryCreate):
    with Session(engine) as session:
        new_category = Category(
            name=category_data.name,
            description=category_data.description,
            image=category_data.image,
            is_active=category_data.is_active
        )

        session.add(new_category)

        try:
            session.commit()
            session.refresh(new_category)
        except IntegrityError:
            session.rollback()
            raise HTTPException(
                status_code=409,
                detail="Category name already exists"
            )

        return new_category


# GET ALL CATEGORIES
@app.get("/categories")
def get_categories():
    with Session(engine) as session:
        return session.query(Category).all()


# UPDATE CATEGORY
@app.put("/categories/{category_id}")
def update_category(
    category_id: str,
    category_data: CategoryUpdate
):
    with Session(engine) as session:
        category = session.get(Category, category_id)

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )

        update_data = category_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(category, key, value)

        try:
            session.commit()
            session.refresh(category)
        except IntegrityError:
            session.rollback()
            raise HTTPException(
                status_code=409,
                detail="Category name already exists"
            )

        return category


# DELETE CATEGORY
@app.delete("/categories/{category_id}")
def delete_category(category_id: str):
    with Session(engine) as session:
        category = session.get(Category, category_id)

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )

        session.delete(category)
        session.commit()

        return {
            "message": "Category deleted successfully"
        }


# ==========================================
# USER REGISTRATION API
# ==========================================

@app.post("/register", status_code=201)
def register_user(user_data: UserCreate):
    with SessionLocal() as db:
        existing_user = db.query(User).filter(
            User.email == str(user_data.email)
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="Email already registered"
            )

        new_user = User(
            name=user_data.name,
            email=str(user_data.email),
            hashed_password=hash_password(user_data.password)
        )

        db.add(new_user)

        try:
            db.commit()
            db.refresh(new_user)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=409,
                detail="Email already registered"
            )

        return {
            "message": "User registered successfully",
            "user_id": str(new_user.id),
            "name": new_user.name,
            "email": new_user.email
        }