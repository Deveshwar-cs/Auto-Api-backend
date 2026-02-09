import express from "express";
import {getGeneratedFiles} from "../controllers/generatedfile.js";

const router = express.Router();

router.get("/:projectId", getGeneratedFiles);

export default router;
