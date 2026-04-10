import {generateSwaggerDocs} from "./generateSwaggerDocs.js";

export const generateRouteCode = (collectionName, fields, protect) => {
  const swaggerDocs = generateSwaggerDocs(collectionName, fields);
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const Name = capitalize(collectionName); // "Product" — for function names only
  // collectionName stays lowercase — for file paths

  const importLine = protect
    ? `import { protect as authMiddleware } from "../middleware/authMiddleware.js";`
    : "";

  return `
import express from "express";
${importLine}

import {
  create${Name},
  getAll${Name}s,
  get${Name}ById,
  update${Name},
  delete${Name}
} from "../controllers/${collectionName}.controller.js";

const router = express.Router();

${swaggerDocs}

/* Routes */
${
  protect
    ? `
router.post("/", authMiddleware, create${Name});
router.get("/", authMiddleware, getAll${Name}s);
router.get("/:id", authMiddleware, get${Name}ById);
router.put("/:id", authMiddleware, update${Name});
router.delete("/:id", authMiddleware, delete${Name});
`
    : `
router.post("/", create${Name});
router.get("/", getAll${Name}s);
router.get("/:id", get${Name}ById);
router.put("/:id", update${Name});
router.delete("/:id", delete${Name});
`
}

export default router;
`;
};
