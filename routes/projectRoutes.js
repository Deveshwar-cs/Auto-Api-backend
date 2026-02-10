import express from "express";
import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from "../controllers/projectController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createProject", protect, createProject);
router.get("/", protect, getProjects);
router.delete("/:id", protect, deleteProject);
router.put("/update/:id", protect, updateProject);

export default router;
