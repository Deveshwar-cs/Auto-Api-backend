
import express from "express";
import {
  createproduct,
  getAllproducts,
  getproductById,
  updateproduct,
  deleteproduct
} from "../controllers/product.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create product
 *     tags: [product]
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
 *         description: product created successfully
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all product
 *     tags: [product]
 *     responses:
 *       200:
 *         description: List of product
 */

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: product found
 */

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update product
 *     tags: [product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: product ID
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
 *         description: product updated successfully
 */

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: product deleted successfully
 */


router.post("/", createproduct);
router.get("/", getAllproducts);
router.get("/:id", getproductById);
router.put("/:id", updateproduct);
router.delete("/:id", deleteproduct);

export default router;
