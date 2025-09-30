import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("Event:", JSON.stringify(event));
  const tableName = process.env.TABLE_NAME;

  try {
    const httpMethod = event.httpMethod;

    if (httpMethod === "POST") {
      // CREATE
      const body = JSON.parse(event.body);
      const item = { id: body.id, name: body.name };

      await docClient.send(new PutCommand({ TableName: tableName, Item: item }));
      return response(200, { message: "Item created", item });
    }

    if (httpMethod === "GET") {
      // READ
      const id = event.pathParameters.id;
      const result = await docClient.send(
        new GetCommand({ TableName: tableName, Key: { id } })
      );
      return response(200, result.Item);
    }

    if (httpMethod === "PUT") {
      // UPDATE
      const id = event.pathParameters.id;
      const body = JSON.parse(event.body);

      const result = await docClient.send(
        new UpdateCommand({
          TableName: tableName,
          Key: { id },
          UpdateExpression: "set #name = :name",
          ExpressionAttributeNames: { "#name": "name" },
          ExpressionAttributeValues: { ":name": body.name },
          ReturnValues: "ALL_NEW",
        })
      );

      return response(200, { message: "Item updated", item: result.Attributes });
    }

    if (httpMethod === "DELETE") {
      // DELETE
      const id = event.pathParameters.id;
      await docClient.send(new DeleteCommand({ TableName: tableName, Key: { id } }));
      return response(200, { message: "Item deleted", id });
    }

    return response(400, { message: "Unsupported method" });
  } catch (err) {
    console.error("Error:", err);
    return response(500, { message: err.message });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
