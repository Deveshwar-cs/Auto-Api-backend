
import express from "express";
import {
  createp2,
  getAllp2s,
  getp2ById,
  updatep2,
  deletep2
} from "../generated/p2.controller.js";

const router = express.Router();

router.post("/", createp2);
router.get("/", getAllp2s);
router.get("/:id", getp2ById);
router.put("/:id", updatep2);
router.delete("/:id", deletep2);

export default router;
