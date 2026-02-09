export const generateRouteCode = (collectionName) => {
  return `
import express from "express";
import {
  create${collectionName},
  getAll${collectionName}s,
  get${collectionName}ById,
  update${collectionName},
  delete${collectionName}
} from "../generated/${collectionName}.controller.js";

const router = express.Router();

router.post("/", create${collectionName});
router.get("/", getAll${collectionName}s);
router.get("/:id", get${collectionName}ById);
router.put("/:id", update${collectionName});
router.delete("/:id", delete${collectionName});

export default router;
`;
};
