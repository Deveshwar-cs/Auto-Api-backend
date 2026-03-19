import fs from "fs";
import path from "path";
import {generateAsyncMiddlewareCode} from "./generateAsyncMiddlewareCode.js";

export const createAsyncMiddlewareFile = (projectPath) => {
  const code = generateAsyncMiddlewareCode();

  const filePath = path.join(projectPath, "middleware", "asyncHandler.js");
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, code);
};
