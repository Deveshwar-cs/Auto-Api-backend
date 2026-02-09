import fs from "fs";
import path from "path";
import {generateAppCode} from "./generateAppCode.js";

export const createAppFile = (projectPath, project) => {
  const code = generateAppCode(project);
  const appPath = path.join(projectPath, "app.js");

  fs.mkdirSync(path.dirname(appPath), {recursive: true});
  fs.writeFileSync(appPath, code);
};
