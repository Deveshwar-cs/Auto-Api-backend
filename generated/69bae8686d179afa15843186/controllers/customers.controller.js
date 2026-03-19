
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import customers from "../models/customers.schema.js";

    export const createcustomers = asyncHandler(async (req, res) => {
    const data = await customers.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAllcustomerss = asyncHandler(async (req, res) => {
    const data = await customers.find();
    res.status(200).json({ success: true, data });
    });

    export const getcustomersById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await customers.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const updatecustomers = asyncHandler(async (req, res) => {
    const data = await customers.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const deletecustomers = asyncHandler(async (req, res) => {
    await customers.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
