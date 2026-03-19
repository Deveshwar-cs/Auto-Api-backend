
import express from "express";
import { protect as authMiddleware } from "../middleware/authMiddleware.js";

import {
  createcustomer,
  getAllcustomers,
  getcustomerById,
  updatecustomer,
  deletecustomer
} from "../controllers/customer.controller.js";

const router = express.Router();


/**
 * @swagger
 * /api/customer:
 *   post:
 *     summary: Create customer
 *     tags: [customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                - name
 *                - professioin
 *              properties:
 *                name:
 *                  type: string
 *                professioin:
 *                  type: string
 *     responses:
 *       201:
 *         description: customer created successfully
 */

/**
 * @swagger
 * /api/customer:
 *   get:
 *     summary: Get all customer
 *     tags: [customer]
 *     responses:
 *       200:
 *         description: List of customer
 */

/**
 * @swagger
 * /api/customer/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [customer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: customer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: customer found
 */

/**
 * @swagger
 * /api/customer/{id}:
 *   put:
 *     summary: Update customer
 *     tags: [customer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                - name
 *                - professioin
 *              properties:
 *                name:
 *                  type: string
 *                professioin:
 *                  type: string
 *     responses:
 *       200:
 *         description: customer updated successfully
 */

/**
 * @swagger
 * /api/customer/{id}:
 *   delete:
 *     summary: Delete customer
 *     tags: [customer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: customer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: customer deleted successfully
 */


/* Routes */

router.post("/", authMiddleware, createcustomer);
router.get("/", authMiddleware, getAllcustomers);
router.get("/:id", authMiddleware, getcustomerById);
router.put("/:id", authMiddleware, updatecustomer);
router.delete("/:id", authMiddleware, deletecustomer);


export default router;
