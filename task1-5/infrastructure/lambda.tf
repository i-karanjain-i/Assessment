resource "aws_lambda_function" "graphql_handler" {
  function_name = "graphqlHandler"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  filename         = var.lambda_zip
  source_code_hash = filebase64sha256(var.lambda_zip)
}
