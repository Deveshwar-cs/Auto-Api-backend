import fs from "fs";
import path from "path";
import {generateControllerCode} from "./generateControllerCode.js";
export const createControllerFile = (projectPath, collectionName) => {
  const code = generateControllerCode(collectionName);

  const controllerPath = path.join(
    projectPath,
    "controllers",
    `${collectionName}.controller.js`,
  );

  fs.mkdirSync(path.dirname(controllerPath), {recursive: true});

  fs.writeFileSync(controllerPath, code);
  console.log("Controller path:", controllerPath);
};
