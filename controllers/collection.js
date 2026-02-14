import {asyncHandler} from "../middleware/asyncHandler.js";
import Collection from "../models/Collection.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";
import path from "path";
import {createSchemaFile} from "../utils/createSchemaFile.js";
import {createControllerFile} from "../utils/createControllerFile.js";
import {createRouteFile} from "../utils/createRouteFile.js";
import fs, {rmSync} from "fs";

const ALLOWED_TYPES = [
  "String",
  "Number",
  "Boolean",
  "Date",
  "ObjectId",
  "Array",
  "Object",
];

const isValidEnumValue = (value, type) => {
  switch (type) {
    case "String":
      return typeof value === "string";
    case "Number":
      return typeof value === "number";
    case "Boolean":
      return typeof value === "boolean";
    case "Date":
      return value instanceof Date || !isNaN(Date.parse(value));
    default:
      return true;
  }
};

const sanitizeFields = (fields) => {
  return fields.map((field) => {
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

    // String enum
    if (field.type === "String" && Array.isArray(field.enum)) {
      cleanField.enum = field.enum;
    }

    // ObjectId
    if (field.type === "ObjectId") {
      if (!field.ref) {
        throw new Error(`ObjectId field '${field.name}' must have ref`);
      }
      cleanField.ref = field.ref;
    }

    // Array
    if (field.type === "Array") {
      if (!field.itemsType || !ALLOWED_TYPES.includes(field.itemsType)) {
        throw new Error(
          `Array field '${field.name}' must have valid itemsType`,
        );
      }

      cleanField.itemsType = field.itemsType;

      if (field.itemsType === "ObjectId") {
        if (!field.ref) {
          throw new Error(`Array ObjectId field '${field.name}' must have ref`);
        }
        cleanField.ref = field.ref;
      }
      if (Array.isArray(field.enum)) {
        const invalid = field.enum.some(
          (val) => !isValidEnumValue(val, field.type),
        );

        if (invalid) {
          throw new Error(
            `Enum values do not match type '${field.type}' for field '${field.name}'`,
          );
        }

        cleanField.enum = field.enum;
      }
    }

    if (field.default !== undefined) {
      cleanField.default = field.default;
    }

    return cleanField;
  });
};

// -------------- Create Collection ----------------------
export const createCollection = asyncHandler(async (req, res) => {
  let {collectionName, fields} = req.body;
  const {projectId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({success: false, message: "Invalid projectId"});
  }

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

  const sanitizedFields = sanitizeFields(fields);

  const collection = await Collection.create({
    projectId,
    collectionName,
    fields: sanitizedFields,
  });

  const projectPath = path.join("generated", projectId.toString());

  createSchemaFile(projectPath, collectionName, sanitizedFields);
  createControllerFile(projectPath, collectionName);
  createRouteFile(projectPath, collectionName);

  res.status(201).json({
    success: true,
    message: "Collection created successfully",
    data: collection,
  });
});

// -------------- Update Collection ----------------------
export const updateCollection = asyncHandler(async (req, res) => {
  let {collectionName, fields} = req.body;
  const {projectId, collId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({success: false, message: "Invalid projectId"});
  }

  if (!collectionName || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: "collectionName and fields are required",
    });
  }

  collectionName = collectionName.trim().toLowerCase();

  const currentCollection = await Collection.findById(collId);
  if (!currentCollection) {
    return res.status(404).json({
      success: false,
      message: "Collection not found",
    });
  }

  const dbName = currentCollection.collectionName.trim().toLowerCase();

  // Only check duplicate if name changed
  if (dbName !== collectionName) {
    const existing = await Collection.findOne({
      projectId,
      collectionName,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Collection already exists in this project",
      });
    }
  }

  const sanitizedFields = sanitizeFields(fields);

  const collection = await Collection.findOneAndUpdate(
    {_id: collId, projectId},
    {$set: {collectionName, fields: sanitizedFields}},
    {new: true},
  );

  const projectPath = path.join("generated", projectId.toString());

  createSchemaFile(projectPath, collectionName, sanitizedFields);
  createControllerFile(projectPath, collectionName);
  createRouteFile(projectPath, collectionName);

  res.status(200).json({
    success: true,
    message: "Collection updated successfully",
    data: collection,
  });
});

// -------------- Get Collection ----------------------
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

// -------------- Delete Collection ----------------------
export const deleteCollection = asyncHandler(async (req, res) => {
  const {projectId, collId} = req.params;

  const collection = await Collection.findById(collId);
  const project = await Project.findById(projectId);

  if (!collection) {
    return res.status(404).json({message: "Collection not found"});
  }

  if (!project) {
    return res.status(404).json({message: "Project not found"});
  }

  if (!req.user || project.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({message: "Not authorized"});
  }

  const projectPath = path.join("generated", projectId.toString());
  const collectionName = collection.collectionName;

  const modelFilePath = path.join(
    projectPath,
    "models",
    `${collectionName}.js`,
  );
  const controllerFilePath = path.join(
    projectPath,
    "controllers",
    `${collectionName}Controller.js`,
  );
  const routeFilePath = path.join(
    projectPath,
    "routes",
    `${collectionName}Routes.js`,
  );

  if (fs.existsSync(modelFilePath)) fs.unlinkSync(modelFilePath);
  if (fs.existsSync(controllerFilePath)) fs.unlinkSync(controllerFilePath);
  if (fs.existsSync(routeFilePath)) fs.unlinkSync(routeFilePath);

  await collection.deleteOne();

  res.status(200).json({message: "Collection deleted successfully"});
});
