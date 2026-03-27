import {generatePackageJsonCode} from "./generatePackageJsonCode.js";

export const createPackageJsonFile = (files) => {
  const code = generatePackageJsonCode();
  files.push({
    name: "package.json",
    path: "package.json",
    content: code,
  });
};
