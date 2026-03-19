
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import product from "../models/product.schema.js";

    export const createproduct = asyncHandler(async (req, res) => {
    const data = await product.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAllproducts = asyncHandler(async (req, res) => {
    const data = await product.find();
    res.status(200).json({ success: true, data });
    });

    export const getproductById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await product.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const updateproduct = asyncHandler(async (req, res) => {
    const data = await product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const deleteproduct = asyncHandler(async (req, res) => {
    await product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
