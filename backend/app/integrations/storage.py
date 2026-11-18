import hashlib
import time
import uuid
from typing import Any, Optional

from app.core.config import settings


def build_media_url(object_key: str) -> str:
    """Resolve a stored object key or URL into a public URL according to STORAGE_PROVIDER."""
    if object_key.startswith(("http://", "https://", "/")):
        return object_key

    clean_key = object_key.lstrip("/")
    if settings.storage_provider == "s3":
        if settings.s3_public_base_url:
            return f"{settings.s3_public_base_url.rstrip('/')}/{clean_key}"
        if settings.s3_bucket_name and settings.s3_region:
            return f"https://{settings.s3_bucket_name}.s3.{settings.s3_region}.amazonaws.com/{clean_key}"
    elif settings.storage_provider == "cloudinary" and settings.cloudinary_cloud_name:
        return f"https://res.cloudinary.com/{settings.cloudinary_cloud_name}/image/upload/{clean_key}"

    return f"/uploads/{clean_key}"


def get_upload_signature_or_presign(
    filename: str,
    folder: str = "gallery",
    content_type: Optional[str] = None,
) -> dict[str, Any]:
    """Generate upload metadata/signature for S3, Cloudinary, or local development."""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
    object_key = f"{folder.strip('/')}/{uuid.uuid4().hex}.{ext}"

    if settings.storage_provider == "cloudinary" and settings.cloudinary_cloud_name and settings.cloudinary_api_secret:
        timestamp = int(time.time())
        params_to_sign = f"folder={folder}&timestamp={timestamp}{settings.cloudinary_api_secret}"
        signature = hashlib.sha1(params_to_sign.encode("utf-8")).hexdigest()
        return {
            "provider": "cloudinary",
            "upload_url": f"https://api.cloudinary.com/v1_1/{settings.cloudinary_cloud_name}/image/upload",
            "api_key": settings.cloudinary_api_key,
            "timestamp": timestamp,
            "signature": signature,
            "folder": folder,
            "public_url": build_media_url(object_key),
        }

    if settings.storage_provider == "s3" and settings.s3_bucket_name:
        return {
            "provider": "s3",
            "bucket": settings.s3_bucket_name,
            "region": settings.s3_region,
            "object_key": object_key,
            "content_type": content_type or "application/octet-stream",
            "public_url": build_media_url(object_key),
        }

    return {
        "provider": "local",
        "object_key": object_key,
        "public_url": build_media_url(object_key),
    }
