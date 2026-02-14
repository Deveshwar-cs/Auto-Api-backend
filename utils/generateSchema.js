import {translateFieldToMongoose} from "./fieldTranslator.js";

export const generateSchemaCode = (collectionName, fields) => {
  let schemaFields = "";

  fields.forEach((field) => {
    const translated = translateFieldToMongoose(field);
    schemaFields += `\n ${field.name}: ${translated},\n`;
  });

  return `
import mongoose from "mongoose";

const ${collectionName}Schema = new mongoose.Schema(
{
  ${schemaFields}
},
{ timestamps: true }
);

export default mongoose.model("${collectionName}", ${collectionName}Schema);
`;
};
