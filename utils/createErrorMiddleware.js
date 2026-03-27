import {generateErrorMiddlewareCode} from "./generateErrorMiddlewareCode.js";

export const createErrorMiddlewareFile = (files) => {
  const code = generateErrorMiddlewareCode();

  files.push({
    name: "errorMiddleware.js",
    path: "src/middleware/errorMiddleware.js",
    content: code,
  });
};
