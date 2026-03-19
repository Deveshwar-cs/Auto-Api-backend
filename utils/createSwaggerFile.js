import fs from "fs";
import path from "path";
import {generateSwaggerCode} from "./generateSwaggerCode.js";

export const createSwaggerFile = (projectPath) => {
  const code = generateSwaggerCode();

  const swaggerPath = path.join(projectPath, "config", "swagger.js");
  fs.mkdirSync(path.dirname(swaggerPath), {recursive: true});
  fs.writeFileSync(swaggerPath, code);
};
