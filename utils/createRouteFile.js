import fs from "fs";
import path from "path";
import {generateRouteCode} from "./generateRouteCode.js";

export const createRouteFile = (
  projectPath,
  collectionName,
  fields,
  protect,
) => {
  const code = generateRouteCode(collectionName, fields, protect);

  const routePath = path.join(
    projectPath,
    "routes",
    `${collectionName}.routes.js`,
  );

  fs.mkdirSync(path.dirname(routePath), {recursive: true});

  fs.writeFileSync(routePath, code);
};
