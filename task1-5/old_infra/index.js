exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));
  
  if (event.info.fieldName === "getItem") {
    return { id: event.arguments.id, name: "Demo Item" };
  }

  if (event.info.fieldName === "createItem") {
    return { id: event.arguments.id, name: event.arguments.name };
  }

  return null;
};
