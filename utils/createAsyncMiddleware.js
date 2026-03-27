import {generateAsyncMiddlewareCode} from "./generateAsyncMiddlewareCode.js";

export const createAsyncMiddlewareFile = (files) => {
  const code = generateAsyncMiddlewareCode();

  files.push({
    name: "asyncHandler.js",
    path: "src/middleware/asyncHandler.js",
    content: code,
  });
};
