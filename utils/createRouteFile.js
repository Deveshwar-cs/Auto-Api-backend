import fs from "fs";
import path from "path";
import {generateRouteCode} from "./generateRouteCode.js";

export const createRouteFile = (projectPath, collectionName) => {
  const code = generateRouteCode(collectionName);

  const routePath = path.join(
    projectPath,
    "routes",
    `${collectionName}.routes.js`,
  );

  fs.mkdirSync(path.dirname(routePath), {recursive: true});

  fs.writeFileSync(routePath, code);
};
