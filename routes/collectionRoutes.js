import express from "express";
import {
  createCollection,
  deleteCollection,
  getCollection,
  updateCollection,
} from "../controllers/collection.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createCollection/:projectId", protect, createCollection);
router.get("/getCollection/:projectId", protect, getCollection);
router.put("/:projectId/update/:collId", protect, updateCollection);
router.delete("/:projectId/delete/:collId", protect, deleteCollection);

export default router;
