
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import p2 from "../generated/p2.js";

    export const createp2 = asyncHandler(async (req, res) => {
    const data = await p2.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAllp2s = asyncHandler(async (req, res) => {
    const data = await p2.find();
    res.status(200).json({ success: true, data });
    });

    export const getp2ById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await p2.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const updatep2 = asyncHandler(async (req, res) => {
    const data = await p2.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const deletep2 = asyncHandler(async (req, res) => {
    await p2.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
