output "graphql_api_url" {
  value = aws_appsync_graphql_api.graphql_api.uris["GRAPHQL"]
}

output "graphql_api_key" {
  value     = aws_appsync_api_key.graphql_api_key.id
  sensitive = true
}

output "lambda_function_arn" {
  value = aws_lambda_function.graphql_handler.arn
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.items.name
}

output "s3_bucket_name" {
  value = aws_s3_bucket.app_bucket.bucket
}
