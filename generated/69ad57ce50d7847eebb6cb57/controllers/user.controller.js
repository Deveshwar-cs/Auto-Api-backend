
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import user from "../generated/user.js";

    export const createuser = asyncHandler(async (req, res) => {
    const data = await user.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAllusers = asyncHandler(async (req, res) => {
    const data = await user.find();
    res.status(200).json({ success: true, data });
    });

    export const getuserById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await user.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const updateuser = asyncHandler(async (req, res) => {
    const data = await user.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const deleteuser = asyncHandler(async (req, res) => {
    await user.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
