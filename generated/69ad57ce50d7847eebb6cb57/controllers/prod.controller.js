
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import prod from "../generated/prod.js";

    export const createprod = asyncHandler(async (req, res) => {
    const data = await prod.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAllprods = asyncHandler(async (req, res) => {
    const data = await prod.find();
    res.status(200).json({ success: true, data });
    });

    export const getprodById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await prod.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const updateprod = asyncHandler(async (req, res) => {
    const data = await prod.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const deleteprod = asyncHandler(async (req, res) => {
    await prod.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
