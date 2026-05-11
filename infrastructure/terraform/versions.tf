# AegisFlow — Terraform provider versions
#
# Pinning major versions keeps Terraform reproducible across student/jury
# machines. Update intentionally, never implicitly.

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Uncomment to use S3-backed remote state once the bucket exists.
  # For PFE local dev, the default local state is fine.
  #
  # backend "s3" {
  #   bucket         = "aegisflow-tfstate-anlehtouf"
  #   key            = "infra/terraform.tfstate"
  #   region         = "eu-west-3"
  #   encrypt        = true
  #   dynamodb_table = "aegisflow-tflock"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "AegisFlow"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = var.owner
    }
  }
}
