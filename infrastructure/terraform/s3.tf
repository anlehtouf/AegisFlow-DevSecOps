# AegisFlow — S3 bucket for artifacts and attachments
#
# Single multi-purpose bucket with prefix-based access:
#   /sbom/         — Syft-generated SBOMs (one per build)
#   /scans/        — Trivy, Semgrep, ZAP JSON reports
#   /attestations/ — Cosign attestation bundles
#   /attachments/  — User-uploaded incident attachments
#
# Hardening: block all public access, SSE-S3 encryption, versioning enabled,
# lifecycle rules to expire old scan reports.

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "artifacts" {
  bucket = "${local.name_prefix}-artifacts-${random_id.bucket_suffix.hex}"
  tags   = { Purpose = "artifacts-and-attachments" }
}

# tfsec:ignore:aws-s3-enable-bucket-logging — single-bucket setup; access
# logs add a second bucket dependency we intentionally skip for PFE scope.

resource "aws_s3_bucket_versioning" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "artifacts" {
  bucket                  = aws_s3_bucket.artifacts.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    id     = "expire-old-scan-reports"
    status = "Enabled"

    filter {
      prefix = "scans/"
    }

    expiration {
      days = 180
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }

  rule {
    id     = "keep-sbom-forever"
    status = "Enabled"

    filter {
      prefix = "sbom/"
    }

    # No expiration — SBOMs are compliance evidence, retain indefinitely.
    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }
}
