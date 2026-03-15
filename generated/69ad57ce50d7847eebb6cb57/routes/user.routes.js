
import express from "express";
import {
  createuser,
  getAllusers,
  getuserById,
  updateuser,
  deleteuser
} from "../generated/user.controller.js";

const router = express.Router();

router.post("/", createuser);
router.get("/", getAllusers);
router.get("/:id", getuserById);
router.put("/:id", updateuser);
router.delete("/:id", deleteuser);

export default router;
