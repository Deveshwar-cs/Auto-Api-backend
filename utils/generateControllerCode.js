export const generateControllerCode = (collectionName) => {
  return `
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import ${collectionName} from "../generated/${collectionName}.js";

    export const create${collectionName} = asyncHandler(async (req, res) => {
    const data = await ${collectionName}.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAll${collectionName}s = asyncHandler(async (req, res) => {
    const data = await ${collectionName}.find();
    res.status(200).json({ success: true, data });
    });

    export const get${collectionName}ById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await ${collectionName}.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const update${collectionName} = asyncHandler(async (req, res) => {
    const data = await ${collectionName}.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const delete${collectionName} = asyncHandler(async (req, res) => {
    await ${collectionName}.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
`;
};
