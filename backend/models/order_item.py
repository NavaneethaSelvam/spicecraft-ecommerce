
import uuid

from sqlalchemy import (
    Column,
    String,
    Integer,
    Numeric,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import UUID

from database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    order_id = Column(
        UUID(as_uuid=True),
        ForeignKey("orders.id"),
        nullable=False,
        index=True,
    )

    product_id = Column(
        String(100),
        nullable=True,
    )

    product_name = Column(
        String(200),
        nullable=False,
    )

    product_image = Column(
        String(500),
        nullable=True,
    )

    unit_price = Column(
        Numeric(10, 2),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    line_total = Column(
        Numeric(10, 2),
        nullable=False,
    )
