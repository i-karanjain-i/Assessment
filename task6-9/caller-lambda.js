const axios = require("axios");

exports.handler = async (event) => {
  const url = process.env.GRAPHQL_API_URL;
  const apiKey = process.env.GRAPHQL_API_KEY;

  // GraphQL query
  const getItemQuery = {
    query: `query GetItem($id: ID!) {
      getItem(id: $id) {
        id
        name
      }
    }`,
    variables: { id: "1" },
  };

  // GraphQL mutation
  const createItemMutation = {
    query: `mutation CreateItem($id: ID!, $name: String!) {
      createItem(id: $id, name: $name) {
        id
        name
      }
    }`,
    variables: { id: "2", name: "Called from Lambda" },
  };

  try {
    // Call getItem
    const getItemResponse = await axios.post(url, getItemQuery, {
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    });

    // Call createItem
    const createItemResponse = await axios.post(url, createItemMutation, {
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        getItem: getItemResponse.data.data.getItem,
        createItem: createItemResponse.data.data.createItem,
      }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify(err.message) };
  }
};
