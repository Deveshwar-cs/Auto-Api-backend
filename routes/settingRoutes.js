import express from "express";
import {
  changePassword,
  getProfile,
  updateProfile,
  updateTheme,
} from "../controllers/settingsController.js";
import {protect} from "../middleware/authMiddleware.js";
import {upload} from "../middleware/upload.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profilePhoto"), updateProfile);
router.put("/theme", protect, updateTheme);
router.put("/password", protect, changePassword);

export default router;
