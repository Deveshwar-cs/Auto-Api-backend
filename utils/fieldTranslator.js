export const translateFieldToMongoose = (field) => {
  const base = {};

  // 🔹 Handle type
  const typeMap = {
    String: "String",
    Number: "Number",
    Boolean: "Boolean",
    Date: "Date",
    ObjectId: "mongoose.Schema.Types.ObjectId",
  };

  // ✅ ARRAY handling
  if (field.type === "Array") {
    const itemType = typeMap[field.itemsType] || "String";

    if (field.itemsType === "ObjectId") {
      return `{
        type: [${itemType}],
        ref: "${field.ref}",
      }`;
    }

    return `[{ type: ${itemType}, trim: true }]`;
  }

  // ✅ Normal types
  let schema = `{
    type: ${typeMap[field.type]},`;

  if (field.required) schema += `\n required: true,`;

  if (field.type === "String") schema += `\n trim: true,`;

  if (field.enum) schema += `\n enum: ${JSON.stringify(field.enum)},`;

  if (field.type === "ObjectId" && field.ref) {
    schema += `\n ref: "${field.ref}",`;
  }

  // ✅ DEFAULT TRANSLATION
  if (field.default) {
    if (field.default === "NOW") {
      schema += `\n default: Date.now,`;
    } else if (field.default === "TRUE") {
      schema += `\n default: true,`;
    } else if (field.default === "FALSE") {
      schema += `\n default: false,`;
    } else {
      schema += `\n default: ${JSON.stringify(field.default)},`;
    }
  }

  schema += `\n }`;

  return schema;
};
