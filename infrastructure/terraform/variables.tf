# AegisFlow — Input variables
#
# Keep defaults conservative (smallest free-tier instances, single NAT).
# Override in terraform.tfvars for staging vs production.

variable "project" {
  description = "Project name, used as resource prefix"
  type        = string
  default     = "aegisflow"
}

variable "environment" {
  description = "Deployment environment (staging | production)"
  type        = string
  default     = "staging"
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be 'staging' or 'production'."
  }
}

variable "owner" {
  description = "Owner tag (email or team) — appears on every resource"
  type        = string
  default     = "anlehtouf@gmail.com"
}

variable "aws_region" {
  description = "AWS region — eu-west-3 is closest to Morocco for low-latency demos"
  type        = string
  default     = "eu-west-3"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "azs" {
  description = "Availability zones to use (must be >= 2 for ALB and RDS)"
  type        = list(string)
  default     = ["eu-west-3a", "eu-west-3b"]
}

# ----- Application image -----------------------------------------------------

variable "image_tag" {
  description = "Container image tag to deploy (set by CI to the commit SHA)"
  type        = string
  default     = "latest"
}

variable "backend_port" {
  description = "Port exposed by the backend container"
  type        = number
  default     = 5000
}

variable "frontend_port" {
  description = "Port exposed by the frontend container"
  type        = number
  default     = 3000
}

# ----- Database --------------------------------------------------------------

variable "db_name" {
  description = "Initial database name"
  type        = string
  default     = "securetrack"
}

variable "db_username" {
  description = "Master DB username"
  type        = string
  default     = "aegisflow_admin"
}

variable "db_instance_class" {
  description = "RDS instance class. db.t4g.micro stays within free tier."
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage_gb" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 20
}

variable "db_multi_az" {
  description = "Multi-AZ deployment for RDS (set true for production)"
  type        = bool
  default     = false
}

# ----- GitHub OIDC federation -------------------------------------------------

variable "github_owner" {
  description = "GitHub organization or user that owns the repo"
  type        = string
  default     = "anlehtouf"
}

variable "github_repo" {
  description = "GitHub repository name (without owner)"
  type        = string
  default     = "AegisFlow-DevSecOps"
}

variable "github_allowed_branches" {
  description = "Branches allowed to assume the GitHub Actions role"
  type        = list(string)
  default     = ["main", "develop", "hardened"]
}

# ----- DNS (optional) --------------------------------------------------------

variable "domain_name" {
  description = "Optional public domain (e.g. 'aegisflow.example.com'). Leave empty to skip Route 53 + ACM."
  type        = string
  default     = ""
}
