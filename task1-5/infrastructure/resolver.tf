resource "aws_appsync_datasource" "lambda_source" {
  api_id           = aws_appsync_graphql_api.graphql_api.id
  name             = "LambdaSource"
  type             = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.graphql_handler.arn
  }

  service_role_arn = aws_iam_role.lambda_exec_role.arn
}

resource "aws_appsync_resolver" "get_item" {
  api_id      = aws_appsync_graphql_api.graphql_api.id
  type        = "Query"
  field       = "getItem"
  data_source = aws_appsync_datasource.lambda_source.name
}

resource "aws_appsync_resolver" "create_item" {
  api_id      = aws_appsync_graphql_api.graphql_api.id
  type        = "Mutation"
  field       = "createItem"
  data_source = aws_appsync_datasource.lambda_source.name
}
