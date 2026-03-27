import {generateAuthMiddlewareCode} from "./generateAuthMiddlewareCode.js";

export const createAuthMiddlewareFile = (files) => {
  const code = generateAuthMiddlewareCode();

  files.push({
    name: "authMiddleware.js",
    path: "src/middleware/authMiddleware.js",
    content: code,
  });
};
