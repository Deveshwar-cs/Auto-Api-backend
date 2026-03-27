import {generateSwaggerCode} from "./generateSwaggerCode.js";
export const createSwaggerFile = (files) => {
  const code = generateSwaggerCode();

  files.push({
    name: "swagger.js",
    path: "src/config/swagger.js",
    content: code,
  });
};
