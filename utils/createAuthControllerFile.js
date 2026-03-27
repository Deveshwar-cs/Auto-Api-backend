import {generateAuthControllerCode} from "./generateAuthControllerCode.js";

export const createAuthControllerFile = (files) => {
  const code = generateAuthControllerCode();

  files.push({
    name: "auth.controller.js",
    path: "src/controllers/auth.controller.js",
    content: code,
  });
};
