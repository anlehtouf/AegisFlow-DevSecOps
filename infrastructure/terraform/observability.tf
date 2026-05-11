# AegisFlow — CloudWatch log groups + dashboards
#
# Centralized log collection. Retention is intentionally short for staging to
# avoid free-tier overage; bump for production via the conditional.

locals {
  log_retention_days = var.environment == "production" ? 90 : 7
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${local.name_prefix}-backend"
  retention_in_days = local.log_retention_days
  tags              = { Component = "backend" }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${local.name_prefix}-frontend"
  retention_in_days = local.log_retention_days
  tags              = { Component = "frontend" }
}

resource "aws_cloudwatch_log_group" "ecs_exec" {
  name              = "/ecs/exec/${local.name_prefix}"
  retention_in_days = local.log_retention_days
  tags              = { Component = "ecs-exec" }
}

# ----- Metric alarms ---------------------------------------------------------

resource "aws_cloudwatch_metric_alarm" "backend_unhealthy_hosts" {
  alarm_name          = "${local.name_prefix}-backend-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "Fires when any backend target is unhealthy"

  dimensions = {
    TargetGroup  = aws_lb_target_group.backend.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }

  treat_missing_data = "notBreaching"
}

resource "aws_cloudwatch_metric_alarm" "rds_high_cpu" {
  alarm_name          = "${local.name_prefix}-rds-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }
}

resource "aws_cloudwatch_metric_alarm" "waf_blocked_requests_spike" {
  alarm_name          = "${local.name_prefix}-waf-blocked-spike"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = 300
  statistic           = "Sum"
  threshold           = 100
  alarm_description   = "Sudden spike in WAF-blocked requests — possible attack"

  dimensions = {
    WebACL = aws_wafv2_web_acl.main.name
    Region = var.aws_region
    Rule   = "ALL"
  }

  treat_missing_data = "notBreaching"
}
