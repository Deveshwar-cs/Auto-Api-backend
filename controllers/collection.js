import {asyncHandler} from "../middleware/asyncHandler.js";
import Collection from "../models/Collection.js";
import mongoose from "mongoose";
import path from "path";
import {createSchemaFile} from "../utils/createSchemaFile.js";
import {createControllerFile} from "../utils/createControllerFile.js";
import {createRouteFile} from "../utils/createRouteFile.js";

const ALLOWED_TYPES = ["String", "Number", "Boolean", "Date", "ObjectId"];

export const createCollection = asyncHandler(async (req, res) => {
  let {collectionName, fields} = req.body;
  const {projectId} = req.params;

  // 1️⃣ Validate projectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid projectId",
    });
  }

  // 2️⃣ Validate input
  if (!collectionName || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: "collectionName and fields are required",
    });
  }

  collectionName = collectionName.trim().toLowerCase();

  const existing = await Collection.findOne({projectId, collectionName});
  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Collection already exists in this project",
    });
  }

  // 3️⃣ Sanitize fields
  const sanitizedFields = fields.map((field) => {
    if (!field.name || typeof field.name !== "string") {
      throw new Error("Invalid field name");
    }

    if (!ALLOWED_TYPES.includes(field.type)) {
      throw new Error(`Invalid field type for ${field.name}`);
    }

    const cleanField = {
      name: field.name.trim(),
      type: field.type,
      required: Boolean(field.required),
    };

    if (field.type === "String" && Array.isArray(field.enum)) {
      cleanField.enum = field.enum;
    }

    if (field.type === "ObjectId" && field.ref) {
      cleanField.ref = field.ref;
    }

    if (field.default !== undefined) {
      cleanField.default = field.default;
    }

    return cleanField;
  });

  // 4️⃣ Save metadata
  const collection = await Collection.create({
    projectId,
    collectionName,
    fields: sanitizedFields,
  });

  // ⭐⭐⭐ IMPORTANT PART ⭐⭐⭐
  // Build the user's backend project path
  const projectPath = path.join("generated", projectId.toString());

  // 5️⃣ Generate backend files for USER project
  try {
    const projectPath = path.join("generated", projectId.toString());

    createSchemaFile(projectPath, collectionName, sanitizedFields);
    createControllerFile(projectPath, collectionName);
    createRouteFile(projectPath, collectionName);
  } catch (err) {
    console.error("❌ File generation error:", err);
    throw err; // let asyncHandler catch it
  }

  return res.status(201).json({
    success: true,
    message: "Collection created and backend files generated successfully",
    data: collection,
  });
});

export const getCollection = asyncHandler(async (req, res) => {
  const {projectId} = req.params;

  const collection = await Collection.find({
    projectId: projectId,
  });

  return res.status(200).json({
    success: true,
    data: collection,
  });
});
