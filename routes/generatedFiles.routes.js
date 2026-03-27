import express from "express";
import {
  downloadProjectZip,
  getGeneratedFiles,
} from "../controllers/generatedfile.js";

const router = express.Router();

router.get("/download/:projectId", downloadProjectZip);
router.get("/:projectId", getGeneratedFiles);

export default router;
