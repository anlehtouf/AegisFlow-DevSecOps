# AegisFlow — Terraform outputs
#
# These outputs are consumed by:
#   - CI/CD (cd-deploy.yml) to know what to push to and what to redeploy
#   - The local developer to verify infrastructure after `terraform apply`
#   - Documentation generators (e.g. report appendix)

output "alb_dns_name" {
  description = "ALB DNS name — the public entry point"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB hosted zone ID — for Route 53 alias records"
  value       = aws_lb.main.zone_id
}

output "ecr_backend_url" {
  description = "ECR backend repository URL — for docker push in CI"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_url" {
  description = "ECR frontend repository URL — for docker push in CI"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name — for `aws ecs update-service` in CI"
  value       = aws_ecs_cluster.main.name
}

output "ecs_backend_service_name" {
  description = "Backend service name"
  value       = aws_ecs_service.backend.name
}

output "ecs_frontend_service_name" {
  description = "Frontend service name"
  value       = aws_ecs_service.frontend.name
}

output "github_actions_role_arn" {
  description = "ARN of the IAM role assumed by GitHub Actions via OIDC"
  value       = aws_iam_role.github_actions.arn
}

output "artifacts_bucket" {
  description = "S3 bucket holding SBOMs, scan reports, and attachments"
  value       = aws_s3_bucket.artifacts.bucket
}

output "rds_endpoint" {
  description = "RDS endpoint (private — only reachable from inside the VPC)"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "db_password_secret_arn" {
  description = "Secrets Manager ARN holding the DB master password"
  value       = aws_secretsmanager_secret.db_password.arn
  sensitive   = true
}

output "jwt_secret_arn" {
  description = "Secrets Manager ARN holding the JWT signing secret"
  value       = aws_secretsmanager_secret.jwt_secret.arn
  sensitive   = true
}

output "guardduty_detector_id" {
  description = "GuardDuty detector ID"
  value       = aws_guardduty_detector.main.id
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}
