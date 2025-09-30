const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "ItemsTable";

module.exports.graphql = async (event) => {
  console.log("Incoming event:", JSON.stringify(event));

  const field = event.info.fieldName;

  if (field === "getItem") {
    const result = await dynamo
      .get({
        TableName: TABLE_NAME,
        Key: { id: event.arguments.id },
      })
      .promise();
    return result.Item;
  }

  if (field === "createItem") {
    const item = { id: event.arguments.id, name: event.arguments.name };
    await dynamo
      .put({
        TableName: TABLE_NAME,
        Item: item,
      })
      .promise();
    return item;
  }

  throw new Error("Unknown field: " + field);
};
