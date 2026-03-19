
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import customer from "../models/customer.schema.js";

    export const createcustomer = asyncHandler(async (req, res) => {
    const data = await customer.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAllcustomers = asyncHandler(async (req, res) => {
    const data = await customer.find();
    res.status(200).json({ success: true, data });
    });

    export const getcustomerById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await customer.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const updatecustomer = asyncHandler(async (req, res) => {
    const data = await customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const deletecustomer = asyncHandler(async (req, res) => {
    await customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
