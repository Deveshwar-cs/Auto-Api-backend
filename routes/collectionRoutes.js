import express from "express";
import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
  generateFiles,
  generateAllCollections,
} from "../controllers/collection.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createCollection/:projectId", protect, createCollection);
router.get("/getCollection/:projectId", protect, getCollections);
router.put("/updateCollection/:projectId/:collId", protect, updateCollection);
router.delete("/:projectId/delete/:collId", protect, deleteCollection);
router.post("/:projectId/:collId/generate", protect, generateFiles);
router.post("/:projectId/generate-all", protect, generateAllCollections);

export default router;
