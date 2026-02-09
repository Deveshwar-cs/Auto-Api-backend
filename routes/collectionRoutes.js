import express from "express";
import {createCollection, getCollection} from "../controllers/collection.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createCollection/:projectId", protect, createCollection);
router.get("/getCollection/:projectId", protect, getCollection);

export default router;
