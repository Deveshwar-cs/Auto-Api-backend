import path from "path";
import fs from "fs";
import {createSchemaFile} from "../utils/createSchemaFile.js";
import {createControllerFile} from "../utils/createControllerFile.js";
import {createRouteFile} from "../utils/createRouteFile.js";

export const generateCollectionFiles = (projectId, collectionName, fields) => {
  const projectPath = path.join("generated", projectId.toString());

  createSchemaFile(projectPath, collectionName, fields);
  createControllerFile(projectPath, collectionName);
  createRouteFile(projectPath, collectionName);
};

export const deleteCollectionFiles = (projectId, collectionName) => {
  const projectPath = path.join("generated", projectId.toString());

  const files = [
    path.join(projectPath, "models", `${collectionName}.schema.js`),
    path.join(projectPath, "controllers", `${collectionName}.controller.js`),
    path.join(projectPath, "routes", `${collectionName}.routes.js`),
  ];

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
};
