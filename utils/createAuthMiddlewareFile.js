import fs from "fs";
import path from "path";
import {generateAuthMiddlewareCode} from "./generateAuthMiddlewareCode.js";

export const createAuthMiddlewareFile = (projectPath) => {
  const code = generateAuthMiddlewareCode();

  const filePath = path.join(projectPath, "middleware", "authMiddleware.js");

  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, code);
};
