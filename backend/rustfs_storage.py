
import os
import uuid
import logging
from pathlib import Path

import boto3
from dotenv import load_dotenv
from botocore.config import Config
from botocore.exceptions import ClientError

load_dotenv()

# --------------------------------------------------
# RustFS Configuration
# --------------------------------------------------

ENDPOINT_URL = os.getenv(
    "RUSTFS_ENDPOINT_URL",
    "http://127.0.0.1:9000",
)

ACCESS_KEY = os.getenv("RUSTFS_ACCESS_KEY")
SECRET_KEY = os.getenv("RUSTFS_SECRET_KEY")

BUCKET_NAME = os.getenv(
    "RUSTFS_BUCKET_NAME",
    "spicecraft-products",
)

REGION = os.getenv("RUSTFS_REGION", "us-east-1")

if not ACCESS_KEY or not SECRET_KEY:
    raise RuntimeError(
        "RUSTFS_ACCESS_KEY and RUSTFS_SECRET_KEY "
        "must be configured in backend .env"
    )

# --------------------------------------------------
# S3-Compatible RustFS Client
# --------------------------------------------------

s3 = boto3.client(
    "s3",
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name=REGION,
    config=Config(
        signature_version="s3v4",
        s3={"addressing_style": "path"},
        connect_timeout=5,
        read_timeout=30,
        retries={"max_attempts": 2},
    ),
)

# --------------------------------------------------
# Supported Image Types
# --------------------------------------------------

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

VALID_EXTENSIONS = {
    "image/jpeg": {".jpg", ".jpeg"},
    "image/png": {".png"},
    "image/webp": {".webp"},
}

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB

# --------------------------------------------------
# Media Manager Section -> RustFS Folder
# --------------------------------------------------

MEDIA_SECTION_FOLDERS = {
    "hero": "hero",
    "banner": "banners",
    "category": "categories",
    "dish": "dishes",
    "product": "products",
    "recipe": "recipes",
    "blog": "blog",
    "about": "about",
    "trust": "trust",
}

ALLOWED_IMAGE_PREFIXES = tuple(
    f"{folder}/"
    for folder in MEDIA_SECTION_FOLDERS.values()
)

# --------------------------------------------------
# Validate Uploaded Image
# --------------------------------------------------

def _validate_image(
    content: bytes,
    content_type: str,
    original_filename: str,
) -> tuple[str, str]:

    content_type = (content_type or "").lower().strip()
    original_filename = original_filename or ""

    extension = ALLOWED_TYPES.get(content_type)

    if not extension:
        raise ValueError(
            "Unsupported image type. Use JPG, PNG, or WEBP."
        )

    if not content:
        raise ValueError("Uploaded image is empty.")

    if len(content) > MAX_IMAGE_SIZE:
        raise ValueError("Image size must not exceed 5 MB.")

    original_extension = Path(original_filename).suffix.lower()

    if original_extension not in VALID_EXTENSIONS[content_type]:
        raise ValueError(
            "Image extension does not match its content type."
        )

    # Check the actual image file signature.
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
        raise ValueError(
            "Uploaded file is not a valid supported image."
        )

    return content_type, extension

# --------------------------------------------------
# Internal Upload Function
# --------------------------------------------------

def _upload_image(
    content: bytes,
    content_type: str,
    original_filename: str,
    folder: str,
) -> str:

    content_type, extension = _validate_image(
        content=content,
        content_type=content_type,
        original_filename=original_filename,
    )

    object_key = f"{folder}/{uuid.uuid4().hex}{extension}"

    try:
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=object_key,
            Body=content,
            ContentType=content_type,
        )

        logging.info(
            "RustFS image uploaded successfully: %s",
            object_key,
        )

    except Exception:
        logging.exception(
            "RustFS upload failed for object: %s",
            object_key,
        )
        raise

    return object_key

# --------------------------------------------------
# Product Image Upload
# --------------------------------------------------

def upload_product_image(
    content: bytes,
    content_type: str,
    original_filename: str,
) -> str:
    """Upload a product image to the products/ folder."""

    return _upload_image(
        content=content,
        content_type=content_type,
        original_filename=original_filename,
        folder="products",
    )

# --------------------------------------------------
# Media Manager Image Upload
# --------------------------------------------------

def upload_media_image(
    content: bytes,
    content_type: str,
    original_filename: str,
    section: str,
) -> str:
    """
    Upload a Media Manager image to its section folder.

    Examples:
        hero     -> hero/
        category -> categories/
        product  -> products/
        recipe   -> recipes/
        blog     -> blog/
        about    -> about/
        banner   -> banners/
        dish     -> dishes/
        trust    -> trust/
    """

    normalized_section = (section or "").lower().strip()
    folder = MEDIA_SECTION_FOLDERS.get(normalized_section)

    if not folder:
        raise ValueError("Invalid media section.")

    return _upload_image(
        content=content,
        content_type=content_type,
        original_filename=original_filename,
        folder=folder,
    )

# --------------------------------------------------
# Retrieve Image from RustFS
# --------------------------------------------------

def get_product_image(object_key: str):
    """Retrieve an image from RustFS using its approved object key."""

    if (
        not object_key
        or not object_key.startswith(ALLOWED_IMAGE_PREFIXES)
        or ".." in object_key
        or "\\" in object_key
    ):
        raise ValueError("Invalid image path.")

    return s3.get_object(
        Bucket=BUCKET_NAME,
        Key=object_key,
    )

# --------------------------------------------------
# Check RustFS Bucket
# --------------------------------------------------

def check_rustfs_bucket() -> bool:
    """Check whether the configured RustFS bucket is accessible."""

    try:
        s3.head_bucket(Bucket=BUCKET_NAME)

        logging.info(
            "RustFS bucket is accessible: %s",
            BUCKET_NAME,
        )
        return True

    except ClientError:
        logging.exception(
            "RustFS bucket check failed: %s",
            BUCKET_NAME,
        )
        return False
