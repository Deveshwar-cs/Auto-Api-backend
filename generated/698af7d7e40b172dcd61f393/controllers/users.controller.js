
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import users from "../generated/users.js";

    export const createusers = asyncHandler(async (req, res) => {
    const data = await users.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAlluserss = asyncHandler(async (req, res) => {
    const data = await users.find();
    res.status(200).json({ success: true, data });
    });

    export const getusersById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await users.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const updateusers = asyncHandler(async (req, res) => {
    const data = await users.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const deleteusers = asyncHandler(async (req, res) => {
    await users.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
