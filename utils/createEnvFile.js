import {generateEnvCode} from "./generateEnvCode.js";

export const createEnvFile = (files, project) => {
  const code = generateEnvCode(project);

  files.push({
    name: ".env",
    path: ".env",
    content: code,
  });
};
