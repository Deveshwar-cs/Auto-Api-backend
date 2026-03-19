
import express from "express";


import {
  createtest2222,
  getAlltest2222s,
  gettest2222ById,
  updatetest2222,
  deletetest2222
} from "../controllers/test2222.controller.js";

const router = express.Router();


/**
 * @swagger
 * /api/test2222:
 *   post:
 *     summary: Create test2222
 *     tags: [test2222]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                - name
 *                - price
 *              properties:
 *                name:
 *                  type: string
 *                price:
 *                  type: number
 *     responses:
 *       201:
 *         description: test2222 created successfully
 */

/**
 * @swagger
 * /api/test2222:
 *   get:
 *     summary: Get all test2222
 *     tags: [test2222]
 *     responses:
 *       200:
 *         description: List of test2222
 */

/**
 * @swagger
 * /api/test2222/{id}:
 *   get:
 *     summary: Get test2222 by ID
 *     tags: [test2222]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: test2222 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: test2222 found
 */

/**
 * @swagger
 * /api/test2222/{id}:
 *   put:
 *     summary: Update test2222
 *     tags: [test2222]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: test2222 ID
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
 *                - price
 *              properties:
 *                name:
 *                  type: string
 *                price:
 *                  type: number
 *     responses:
 *       200:
 *         description: test2222 updated successfully
 */

/**
 * @swagger
 * /api/test2222/{id}:
 *   delete:
 *     summary: Delete test2222
 *     tags: [test2222]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: test2222 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: test2222 deleted successfully
 */


/* Routes */

router.post("/", createtest2222);
router.get("/", getAlltest2222s);
router.get("/:id", gettest2222ById);
router.put("/:id", updatetest2222);
router.delete("/:id", deletetest2222);


export default router;
