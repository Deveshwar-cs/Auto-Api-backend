import fs from "fs";
import path from "path";

export const generateSchemaCode = (collectionName, fields) => {
  const mongooseTypeMap = {
    String: "String",
    Number: "Number",
    Boolean: "Boolean",
    Date: "Date",
    ObjectId: "mongoose.Schmea.Types.ObjectId",
  };
  let schmemaFields = "";
  fields.forEach((field) => {
    schmemaFields += `\n ${field.name}: {`;
    schmemaFields += `\n type: ${mongooseTypeMap[field.type]},`;
    schmemaFields += `\n required: ${field.required || false},`;

    if (field.type === "String") schmemaFields += `\n trim: true,`;
    if (field.enum) schmemaFields += `\n enum: ${JSON.stringify(field.enum)},`;
    if (field.type === "ObjectId" && field.ref) {
      schmemaFields += `\n ref: "${field.ref}",`;
    }
    schmemaFields += `\n },`;
  });

  return `
  import mongoose from "mongoose";
  const ${collectionName.toLowerCase()}Schema = new mongoose.Schema(
  {
  ${schmemaFields}
  },
  {timestamps: true}
  );
  export default mongoose.model("${collectionName}",${collectionName.toLowerCase()}Schema);
  `;
};

// Give below code for testing purpose:-
// import fs from "fs";
// const fields = [
//   {name: "title", type: "String", required: true},
//   {name: "price", type: "Number", required: true},
//   {name: "isPublished", type: "Boolean"},
//   {
//     name: "status",
//     type: "String",
//     enum: ["pending", "approved", "rejected"],
//   },
//   {
//     name: "user",
//     type: "ObjectId",
//     ref: "User",
//     required: true,
//   },
// ];

// const schemaCode = generateSchemaCode("Product", fields);
// console.log(schemaCode);

// const assertIncludes = (text, value) => {
//   if (!text.includes(value)) {
//     console.error(`❌ Missing: ${value}`);
//   } else {
//     console.log(`✅ Found: ${value}`);
//   }
// };

// assertIncludes(schemaCode, "title");
// assertIncludes(schemaCode, "type: String");
// assertIncludes(schemaCode, "required: true");
// assertIncludes(schemaCode, "enum");
// assertIncludes(schemaCode, 'ref: "User"');
// assertIncludes(schemaCode, "timestamps: true");

// fs.writeFileSync("./Product.model.js", schemaCode);
// console.log("✅ Schema file created!");
