import uuid

from sqlalchemy import (
    Column,
    String,
    DateTime,
    Numeric,
    ForeignKey,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    order_number = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    # Registered customers can have a user_id.
    # Guest checkout orders can have user_id=None.
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    # Store only the hash of the private tracking token.
    tracking_token_hash = Column(
        String(64),
        nullable=True,
        unique=True,
        index=True,
    )

    customer_name = Column(
        String(150),
        nullable=False,
    )

    email = Column(
        String(255),
        nullable=False,
    )

    phone = Column(
        String(20),
        nullable=False,
    )

    delivery_address = Column(
        Text,
        nullable=False,
    )

    subtotal = Column(
        Numeric(10, 2),
        nullable=False,
    )

    delivery_charge = Column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    coupon_code = Column(
        String(50),
        nullable=True,
        index=True,
    )

    discount_amount = Column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    total_amount = Column(
        Numeric(10, 2),
        nullable=False,
    )

    payment_method = Column(
        String(50),
        nullable=False,
        default="Cash on Delivery",
    )

    status = Column(
        String(30),
        nullable=False,
        default="Order Placed",
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
