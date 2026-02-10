
import express from "express";
import {
  createusers,
  getAlluserss,
  getusersById,
  updateusers,
  deleteusers
} from "../generated/users.controller.js";

const router = express.Router();

router.post("/", createusers);
router.get("/", getAlluserss);
router.get("/:id", getusersById);
router.put("/:id", updateusers);
router.delete("/:id", deleteusers);

export default router;
