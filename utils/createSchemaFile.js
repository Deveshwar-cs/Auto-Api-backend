import fs from "fs";
import path from "path";
import {generateSchemaCode} from "./generateSchema.js";

export const createSchemaFile = (projectPath, collectionName, fields) => {
  const code = generateSchemaCode(collectionName, fields);

  const schemaPath = path.join(
    projectPath,
    "models",
    `${collectionName}.schema.js`,
  );

  fs.mkdirSync(path.dirname(schemaPath), {recursive: true});

  fs.writeFileSync(schemaPath, code);
};
