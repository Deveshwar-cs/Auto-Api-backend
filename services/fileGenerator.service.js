import {generateSchemaCode} from "../utils/generateSchema.js";
import {generateControllerCode} from "../utils/generateControllerCode.js";
import {generateRouteCode} from "../utils/generateRouteCode.js";

export const generateCollectionFiles = (name, fields, protect) => {
  const files = [];
  files.push({
    name: `${name}.model.js`,
    path: `src/models/${name}.model.js`,
    content: generateSchemaCode(name, fields),
  });

  files.push({
    name: `${name}.controller.js`,
    path: `src/controllers/${name}.controller.js`,
    content: generateControllerCode(name),
  });

  files.push({
    name: `${name}.routes.js`,
    path: `src/routes/${name}.routes.js`,
    content: generateRouteCode(name, fields, protect),
  });

  return files;
};
