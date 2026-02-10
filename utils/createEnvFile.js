import fs from "fs";
import path from "path";
import {generateEnvCode} from "./generateEnvCode.js";

export const createEnvFile = (projectPath, project) => {
  const envPath = path.join(projectPath, ".env");

  fs.mkdirSync(path.dirname(envPath), {recursive: true});

  fs.writeFileSync(envPath, generateEnvCode(project));
};
