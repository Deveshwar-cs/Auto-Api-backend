import {generateDbCode} from "./generateDbCode.js";

export const createDbFile = (files) => {
  const code = generateDbCode();

  files.push({
    name: "db.js",
    path: "src/config/db.js",
    content: code,
  });
};
