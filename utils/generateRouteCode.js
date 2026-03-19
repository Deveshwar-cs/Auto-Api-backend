import {generateSwaggerDocs} from "./generateSwaggerDocs.js";

export const generateRouteCode = (collectionName, fields, protect) => {
  const swaggerDocs = generateSwaggerDocs(collectionName, fields);
  const importLine = protect
    ? `import { protect as authMiddleware } from "../middleware/authMiddleware.js";`
    : "";

  return `
import express from "express";
${importLine}

import {
  create${collectionName},
  getAll${collectionName}s,
  get${collectionName}ById,
  update${collectionName},
  delete${collectionName}
} from "../controllers/${collectionName}.controller.js";

const router = express.Router();

${swaggerDocs}

/* Routes */
${
  protect
    ? `
router.post("/", authMiddleware, create${collectionName});
router.get("/", authMiddleware, getAll${collectionName}s);
router.get("/:id", authMiddleware, get${collectionName}ById);
router.put("/:id", authMiddleware, update${collectionName});
router.delete("/:id", authMiddleware, delete${collectionName});
`
    : `
router.post("/", create${collectionName});
router.get("/", getAll${collectionName}s);
router.get("/:id", get${collectionName}ById);
router.put("/:id", update${collectionName});
router.delete("/:id", delete${collectionName});
`
}

export default router;
`;
};
