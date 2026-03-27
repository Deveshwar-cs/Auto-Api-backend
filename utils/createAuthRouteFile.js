import {generateAuthRoutesCode} from "./generateAuthRoutesCode.js";

export const createAuthRoutesFile = (files) => {
  const code = generateAuthRoutesCode();

  files.push({
    name: "auth.routes.js",
    path: "src/routes/auth.routes.js",
    content: code,
  });
};
