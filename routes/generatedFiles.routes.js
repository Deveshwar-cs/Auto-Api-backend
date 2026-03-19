import express from "express";
import {
  downloadProjectZip,
  getGeneratedFiles,
} from "../controllers/generatedfile.js";

const router = express.Router();

router.get("/:projectId", getGeneratedFiles);
router.get("/download/:projectId", downloadProjectZip);

export default router;
