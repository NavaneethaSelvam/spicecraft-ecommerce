from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class CouponBase(BaseModel):
    code: str = Field(min_length=2, max_length=50)
    description: Optional[str] = None
    discount_type: str = Field(default="percentage")  # "percentage" or "fixed"
    discount_value: Decimal = Field(gt=0)
    min_order_amount: Decimal = Field(default=Decimal("0.00"), ge=0)
    max_discount_amount: Optional[Decimal] = Field(default=None, gt=0)
    total_usage_limit: Optional[int] = Field(default=None, gt=0)
    max_usage_per_customer: Optional[int] = Field(default=1, gt=0)
    start_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    is_active: bool = True

    @field_validator("code")
    @classmethod
    def validate_code(cls, v: str) -> str:
        cleaned = v.strip().upper()
        if not cleaned:
            raise ValueError("Coupon code cannot be empty.")
        if " " in cleaned:
            raise ValueError("Coupon code cannot contain spaces.")
        return cleaned

    @field_validator("discount_type")
    @classmethod
    def validate_discount_type(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if cleaned not in ("percentage", "fixed"):
            raise ValueError("Discount type must be either 'percentage' or 'fixed'.")
        return cleaned


class CouponCreate(CouponBase):
    pass


class CouponUpdate(BaseModel):
    code: Optional[str] = Field(default=None, min_length=2, max_length=50)
    description: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[Decimal] = Field(default=None, gt=0)
    min_order_amount: Optional[Decimal] = Field(default=None, ge=0)
    max_discount_amount: Optional[Decimal] = Field(default=None, gt=0)
    total_usage_limit: Optional[int] = Field(default=None, gt=0)
    max_usage_per_customer: Optional[int] = Field(default=None, gt=0)
    start_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    is_active: Optional[bool] = None

    @field_validator("code")
    @classmethod
    def validate_code(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip().upper()
        if not cleaned:
            raise ValueError("Coupon code cannot be empty.")
        if " " in cleaned:
            raise ValueError("Coupon code cannot contain spaces.")
        return cleaned

    @field_validator("discount_type")
    @classmethod
    def validate_discount_type(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip().lower()
        if cleaned not in ("percentage", "fixed"):
            raise ValueError("Discount type must be either 'percentage' or 'fixed'.")
        return cleaned


class CouponResponse(BaseModel):
    id: UUID
    code: str
    description: Optional[str] = None
    discount_type: str
    discount_value: Decimal
    min_order_amount: Decimal
    max_discount_amount: Optional[Decimal] = None
    total_usage_limit: Optional[int] = None
    max_usage_per_customer: Optional[int] = 1
    times_used: int = 0
    start_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CouponStatusToggle(BaseModel):
    is_active: bool


class CouponValidateRequest(BaseModel):
    code: str = Field(min_length=1)
    subtotal: Decimal = Field(ge=0)
    email: Optional[str] = None
    phone: Optional[str] = None


class CouponValidateResponse(BaseModel):
    valid: bool
    code: str
    discount_type: str
    discount_value: Decimal
    discount_amount: Decimal
    min_order_amount: Decimal
    max_discount_amount: Optional[Decimal] = None
    description: Optional[str] = None
    message: str
