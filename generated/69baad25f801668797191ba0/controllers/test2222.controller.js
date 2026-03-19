
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import test2222 from "../models/test2222.schema.js";

    export const createtest2222 = asyncHandler(async (req, res) => {
    const data = await test2222.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAlltest2222s = asyncHandler(async (req, res) => {
    const data = await test2222.find();
    res.status(200).json({ success: true, data });
    });

    export const gettest2222ById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await test2222.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const updatetest2222 = asyncHandler(async (req, res) => {
    const data = await test2222.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const deletetest2222 = asyncHandler(async (req, res) => {
    await test2222.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
