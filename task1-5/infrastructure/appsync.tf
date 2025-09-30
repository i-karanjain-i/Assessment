resource "aws_appsync_graphql_api" "graphql_api" {
  name                = "MyGraphqlApi"
  authentication_type = "API_KEY"
}

resource "aws_appsync_api_key" "graphql_api_key" {
  api_id = aws_appsync_graphql_api.graphql_api.id
}

resource "aws_appsync_graphql_api" "graphql_api" {
  name                = "GraphqlApi"
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