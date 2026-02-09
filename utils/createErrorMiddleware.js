import fs from "fs";
import path from "path";
import {generateErrorMiddlewareCode} from "./generateErrorMiddlewareCode.js";

export const createErrorMiddlewareFile = (projectPath) => {
  const code = generateErrorMiddlewareCode();

  const middlewarePath = path.join(
    projectPath,
    "middleware",
    "errorMiddleware.js",
  );

  fs.mkdirSync(path.dirname(middlewarePath), {recursive: true});
  fs.writeFileSync(middlewarePath, code);
};
