import express from "express";
import {getOverviewStats} from "../controllers/dashboard.controller.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getOverviewStats);
export default router;
