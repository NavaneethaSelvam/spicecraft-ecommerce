from sqlalchemy import Column, String, Text, Float, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid


class Product(Base):
    __tablename__ = "products"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )

    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    image = Column(String(255), nullable=True)
    stock = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)