import uuid

from sqlalchemy import (
    Column,
    String,
    DateTime,
    Numeric,
    Integer,
    Boolean,
    ForeignKey,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database import Base


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    code = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    description = Column(
        Text,
        nullable=True,
    )

    # "percentage" or "fixed"
    discount_type = Column(
        String(20),
        nullable=False,
        default="percentage",
    )

    # e.g. 10.00 for 10% or 100.00 for ₹100
    discount_value = Column(
        Numeric(10, 2),
        nullable=False,
    )

    min_order_amount = Column(
        Numeric(10, 2),
        nullable=False,
        default=0.00,
    )

    # Max discount in rupees for percentage coupons (optional cap)
    max_discount_amount = Column(
        Numeric(10, 2),
        nullable=True,
    )

    # Total redemptions allowed across all customers (None = unlimited)
    total_usage_limit = Column(
        Integer,
        nullable=True,
    )

    # Max redemptions per customer (None = unlimited, default 1)
    max_usage_per_customer = Column(
        Integer,
        nullable=True,
        default=1,
    )

    times_used = Column(
        Integer,
        nullable=False,
        default=0,
    )

    start_date = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    expiry_date = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    redemptions = relationship(
        "CouponRedemption",
        back_populates="coupon",
        cascade="all, delete-orphan",
    )


class CouponRedemption(Base):
    __tablename__ = "coupon_redemptions"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    coupon_id = Column(
        UUID(as_uuid=True),
        ForeignKey("coupons.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    order_id = Column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    customer_email = Column(
        String(255),
        nullable=False,
        index=True,
    )

    customer_phone = Column(
        String(20),
        nullable=False,
        index=True,
    )

    discount_amount = Column(
        Numeric(10, 2),
        nullable=False,
        default=0.00,
    )

    status = Column(
        String(30),
        nullable=False,
        default="active",
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    coupon = relationship("Coupon", back_populates="redemptions")
