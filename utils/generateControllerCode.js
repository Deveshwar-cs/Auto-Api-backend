// Add this helper at the top
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const generateControllerCode = (collectionName) => {
  const Name = capitalize(collectionName); // e.g. "product" → "Product"

  return `
    import mongoose from "mongoose";
    import { asyncHandler } from "../middleware/asyncHandler.js";
    import ${collectionName} from "../models/${collectionName}.model.js";

    export const create${Name} = asyncHandler(async (req, res) => {
    const data = await ${collectionName}.create(req.body);
    res.status(201).json({ success: true, data });
    });

    export const getAll${Name}s = asyncHandler(async (req, res) => {
    const data = await ${collectionName}.find();
    res.status(200).json({ success: true, data });
    });

    export const get${Name}ById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const data = await ${collectionName}.findById(req.params.id);
    res.status(200).json({ success: true, data });
    });

    export const update${Name} = asyncHandler(async (req, res) => {
    const data = await ${collectionName}.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data });
    });

    export const delete${Name} = asyncHandler(async (req, res) => {
    await ${collectionName}.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
    });
`;
};
