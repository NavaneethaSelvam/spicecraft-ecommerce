from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field, EmailStr


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(gt=0, le=100)


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    phone: str = Field(min_length=10, max_length=20)
    delivery_address: str = Field(min_length=5, max_length=1000)

    payment_method: str = "Cash on Delivery"
    coupon_code: Optional[str] = None

    items: List[OrderItemCreate] = Field(min_length=1)


class OrderStatusUpdate(BaseModel):
    status: str


class OrderItemResponse(BaseModel):
    product_id: str | None = None
    product_name: str
    product_image: str | None = None
    unit_price: Decimal
    quantity: int
    line_total: Decimal


class OrderResponse(BaseModel):
    order_number: str
    customer_name: str
    email: EmailStr
    phone: str
    delivery_address: str
    subtotal: Decimal
    delivery_charge: Decimal
    coupon_code: Optional[str] = None
    discount_amount: Decimal = Decimal("0.00")
    total_amount: Decimal
    payment_method: str
    status: str
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
