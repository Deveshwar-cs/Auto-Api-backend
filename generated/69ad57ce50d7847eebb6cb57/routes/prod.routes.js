
import express from "express";
import {
  createprod,
  getAllprods,
  getprodById,
  updateprod,
  deleteprod
} from "../generated/prod.controller.js";

const router = express.Router();

router.post("/", createprod);
router.get("/", getAllprods);
router.get("/:id", getprodById);
router.put("/:id", updateprod);
router.delete("/:id", deleteprod);

export default router;
