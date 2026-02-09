import fs from "fs";
import path from "path";
import {generateAuthControllerCode} from "./generateAuthControllerCode.js";

export const createAuthControllerFile = (projectPath) => {
  const code = generateAuthControllerCode();

  const filePath = path.join(projectPath, "controllers", "auth.controller.js");

  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, code);
};
