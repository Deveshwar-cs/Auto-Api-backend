
import express from "express";
import { protect as authMiddleware } from "../middleware/authMiddleware.js";

import {
  createcustomers,
  getAllcustomerss,
  getcustomersById,
  updatecustomers,
  deletecustomers
} from "../controllers/customers.controller.js";

const router = express.Router();


/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create customers
 *     tags: [customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                - name
 *                - gmail
 *                - role
 *              properties:
 *                name:
 *                  type: string
 *                gmail:
 *                  type: string
 *                role:
 *                  type: string
 *     responses:
 *       201:
 *         description: customers created successfully
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [customers]
 *     responses:
 *       200:
 *         description: List of customers
 */

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customers by ID
 *     tags: [customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: customers ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: customers found
 */

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update customers
 *     tags: [customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: customers ID
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
 *                - gmail
 *                - role
 *              properties:
 *                name:
 *                  type: string
 *                gmail:
 *                  type: string
 *                role:
 *                  type: string
 *     responses:
 *       200:
 *         description: customers updated successfully
 */

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete customers
 *     tags: [customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: customers ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: customers deleted successfully
 */


/* Routes */

router.post("/", authMiddleware, createcustomers);
router.get("/", authMiddleware, getAllcustomerss);
router.get("/:id", authMiddleware, getcustomersById);
router.put("/:id", authMiddleware, updatecustomers);
router.delete("/:id", authMiddleware, deletecustomers);


export default router;
