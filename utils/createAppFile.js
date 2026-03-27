import {generateAppCode} from "./generateAppCode.js";
export const createAppFile = (files, project) => {
  const code = generateAppCode(project);
  files.push({
    name: "app.js",
    path: "src/app.js",
    content: code,
  });
};
