provider "aws" {
  region = "us-east-1"
}

# -------------------
# DynamoDB
# -------------------
resource "aws_dynamodb_table" "items" {
  name         = "ItemsTable"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

# -------------------
# S3 Bucket
# -------------------
resource "aws_s3_bucket" "app_bucket" {
  bucket = "my-app-storage-bucket"
}

# -------------------
# IAM Role for Lambda
# -------------------
resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "lambda_exec_attach" {
  name       = "lambda-basic-execution"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy_attachment" "lambda_dynamodb_attach" {
  name       = "lambda-dynamodb-access"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_policy_attachment" "lambda_s3_attach" {
  name       = "lambda-s3-access"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

# -------------------
# Lambda Function
# -------------------
resource "aws_lambda_function" "graphql_handler" {
  function_name = "graphqlHandler"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  filename         = "lambda.zip"    # Upload your build zip
  source_code_hash = filebase64sha256("lambda.zip")
}

# -------------------
# AppSync GraphQL API
# -------------------
resource "aws_appsync_graphql_api" "graphql_api" {
  name                = "MyGraphqlApi"
  authentication_type = "API_KEY"

  schema = <<EOF
type Query {
  getItem(id: ID!): Item
}

type Mutation {
  createItem(id: ID!, name: String!): Item
}

type Item {
  id: ID!
  name: String!
}

schema {
  query: Query
  mutation: Mutation
}
EOF
}


# API Key
resource "aws_appsync_api_key" "graphql_api_key" {
  api_id = aws_appsync_graphql_api.graphql_api.id
}

# Lambda Data Source
resource "aws_appsync_datasource" "lambda_source" {
  api_id           = aws_appsync_graphql_api.graphql_api.id
  name             = "LambdaSource"
  type             = "AWS_LAMBDA"
  lambda_config {
    function_arn = aws_lambda_function.graphql_handler.arn
  }
  service_role_arn = aws_iam_role.lambda_exec_role.arn
}

# Resolver for Query
resource "aws_appsync_resolver" "get_item" {
  api_id      = aws_appsync_graphql_api.graphql_api.id
  type        = "Query"
  field       = "getItem"
  data_source = aws_appsync_datasource.lambda_source.name
}

# Resolver for Mutation
resource "aws_appsync_resolver" "create_item" {
  api_id      = aws_appsync_graphql_api.graphql_api.id
  type        = "Mutation"
  field       = "createItem"
  data_source = aws_appsync_datasource.lambda_source.name
}
