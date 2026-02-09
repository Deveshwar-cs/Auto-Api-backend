import fs from "fs";
import path from "path";
import {generatePackageJsonCode} from "./generatePackageJsonCode.js";

export const createPackageJsonFile = (projectPath) => {
  const pkgPath = path.join(projectPath, "package.json");
  fs.writeFileSync(pkgPath, generatePackageJsonCode());
};
