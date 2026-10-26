
import uuid

from sqlalchemy import Column, String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID

from database import Base


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )

    title = Column(String(200), nullable=False)
    section = Column(String(50), nullable=False, index=True)
    object_key = Column(String(500), nullable=False, unique=True)
    image_url = Column(String(1000), nullable=False)
    alt_text = Column(String(300), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
