# AegisFlow — Runtime security
#
# Enables AWS-native runtime threat detection:
#   - GuardDuty: ML-based anomaly + threat detection on VPC flow, DNS, CloudTrail
#   - Inspector v2: continuous CVE scanning of ECR images and running ECS tasks
#
# Both are free-tier eligible for the first 30 days and produce SIEM-grade
# findings that complement our build-time scans.

# ----- GuardDuty -------------------------------------------------------------

resource "aws_guardduty_detector" "main" {
  enable = true

  datasources {
    s3_logs {
      enable = true
    }
    kubernetes {
      audit_logs {
        enable = false # No EKS in AegisFlow
      }
    }
    malware_protection {
      scan_ec2_instance_with_findings {
        ebs_volumes {
          enable = false # Fargate-only, no EBS
        }
      }
    }
  }

  finding_publishing_frequency = "FIFTEEN_MINUTES"

  tags = { Name = "${local.name_prefix}-guardduty" }
}

# ----- Inspector v2 ----------------------------------------------------------

resource "aws_inspector2_enabler" "main" {
  account_ids    = [data.aws_caller_identity.current.account_id]
  resource_types = ["ECR"]
  # Add "EC2" if/when EC2-based runtime is introduced.
  # ECS tasks running on Fargate are scanned via their ECR image findings.
}

data "aws_caller_identity" "current" {}
