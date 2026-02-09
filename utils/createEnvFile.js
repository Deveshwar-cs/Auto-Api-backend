import fs from "fs";
import path from "path";
import {generateEnvCode} from "./generateEnvCode.js";

export const createEnvFile = (projectPath, project) => {
  const envPath = path.join(projectPath, ".env");
  fs.writeFileSync(envPath, generateEnvCode(project));
};
