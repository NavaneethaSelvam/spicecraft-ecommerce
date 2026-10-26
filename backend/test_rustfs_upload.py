import logging
from rustfs_storage import (
    upload_media_image,
    get_product_image,
    BUCKET_NAME,
)

logging.basicConfig(level=logging.INFO)

# Minimal valid 1x1 PNG image
png_bytes = bytes.fromhex(
    "89504e470d0a1a0a0000000d494844520000000100000001"
    "08060000001f15c4890000000b49444154789c6360000200"
    "00050001a5f645400000000049454e44ae426082"
)

try:
    key = upload_media_image(
        content=png_bytes,
        content_type="image/png",
        original_filename="test.png",
        section="trust",
    )

    print("Bucket:", BUCKET_NAME)
    print("Uploaded key:", key)

    result = get_product_image(key)
    body = result["Body"].read()

    print("Downloaded bytes:", len(body))
    print("Content type:", result.get("ContentType"))
    print("RustFS read-back successful:", body == png_bytes)

except Exception:
    logging.exception("RustFS diagnostic test failed")