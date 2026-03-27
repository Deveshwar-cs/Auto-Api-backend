import {generateUserModelCode} from "./generateUserModelCode.js";

export const createUserModelFile = (files) => {
  const code = generateUserModelCode();

  files.push({
    name: "user.model.js",
    path: "src/models/user.model.js",
    content: code,
  });
};
