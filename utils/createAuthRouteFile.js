import fs from "fs";
import path from "path";
import {generateAuthRoutesCode} from "./generateAuthRoutesCode.js";

export const createAuthRoutesFile = (projectPath) => {
  const code = generateAuthRoutesCode();

  const filePath = path.join(projectPath, "routes", "auth.routes.js");

  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, code);
};
