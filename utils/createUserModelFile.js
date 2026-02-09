import fs from "fs";
import path from "path";
import {generateUserModelCode} from "./generateUserModelCode.js";

export const createUserModelFile = (projectPath) => {
  const code = generateUserModelCode();

  const filePath = path.join(projectPath, "models", "user.model.js");

  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, code);
};
