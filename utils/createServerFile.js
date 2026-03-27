import {generateServerCode} from "./generateServerCode.js";

export const createServerFile = (files) => {
  const code = generateServerCode();
  files.push({
    name: "server.js",
    path: "src/server.js",
    content: code,
  });
};
