variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "lambda_zip" {
  description = "Path to Lambda deployment package"
  type        = string
  default     = "lambda.zip"
}

variable "s3_bucket_name" {
  description = "App S3 bucket name"
  type        = string
  default     = "my-app-storage-bucket"
}
