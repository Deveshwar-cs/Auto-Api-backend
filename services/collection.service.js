import Collection from "../models/Collection.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";
import {sanitizeFields} from "../utils/sanitizeFields.js";
import {generateCollectionFiles} from "./fileGenerator.service.js";
import GeneratedFile from "../models/GeneratedFile.js";

export const createCollectionService = async (
  projectId,
  collectionName,
  filterField,
  protect,
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  collectionName = collectionName.trim().toLowerCase();

  const existing = await Collection.findOne({projectId, collectionName});
  if (existing) {
    throw new Error("Collection already exists in this project");
  }

  const sanitizedFields = sanitizeFields(filterField);

  const collection = await Collection.create({
    projectId,
    collectionName,
    fields: sanitizedFields,
    isGenerated: false,
    lastGeneratedAt: null,
    protect,
  });

  await Project.findByIdAndUpdate(projectId, {
    $inc: {collectionsCount: 1},
  });

  return collection;
};

export const deleteCollectionService = async (projectId, collId, userId) => {
  const collection = await Collection.findById(collId);
  const project = await Project.findById(projectId);

  if (!collection) throw new Error("Collection not found");
  if (!project) throw new Error("Project not found");

  if (project.userId.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  deleteCollectionFiles(projectId, collection.collectionName);

  await collection.deleteOne();

  await Project.findByIdAndUpdate(projectId, {
    $inc: {collectionsCount: -1},
  });

  return true;
};

export const updateCollectionService = async (
  projectId,
  collId,
  collectionName,
  filterField,
  protect,
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  const currentCollection = await Collection.findById(collId);
  if (!currentCollection) {
    throw new Error("Collection not found");
  }

  collectionName = collectionName.trim().toLowerCase();

  // 🔥 If name changed → check duplicate
  if (currentCollection.collectionName !== collectionName) {
    const existing = await Collection.findOne({
      projectId,
      collectionName,
    });

    if (existing) {
      throw new Error("Collection already exists in this project");
    }
  }

  const sanitizedFields = sanitizeFields(filterField);
  // 🔥 If renamed → delete old files first
  if (currentCollection.collectionName !== collectionName) {
    deleteCollectionFiles(projectId, currentCollection.collectionName);
  }
  // Update DB
  const updatedCollection = await Collection.findOneAndUpdate(
    {_id: collId, projectId},
    {
      $set: {
        collectionName,
        protect,
        fields: sanitizedFields,
        isGenerated: false,
      },
    },
    {new: true},
  );

  return updatedCollection;
};

export const getCollectionsService = async (projectId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // 🔥 Authorization check (important for SaaS)
  if (project.userId.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  const collections = await Collection.find({projectId});

  return collections;
};

export const generateFilesService = async (projectId, collId, userId) => {
  const collection = await Collection.findById(collId);
  const project = await Project.findById(projectId);

  if (!collection) throw new Error("Collection not found");
  if (!project) throw new Error("Project not found");

  if (project.userId.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  const generated = await GeneratedFile.findOne({projectId});

  if (!generated) {
    throw new Error("Base project files not found");
  }

  let files = generated.files;

  const {collectionName, fields, protect} = collection;

  // ✅ Remove old files of this collection
  files = files.filter((file) => !file.path.includes(`/${collectionName}`));

  // ✅ Generate new files
  const newFiles = generateCollectionFiles(collectionName, fields, protect);

  // ✅ Save updated files
  generated.files = [...files, ...newFiles];
  await generated.save();

  // ✅ Update collection status
  collection.isGenerated = true;
  collection.lastGeneratedAt = new Date();
  await collection.save();

  return true;
};

export const generateAllCollectionsService = async (projectId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.userId.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  const collections = await Collection.find({projectId});

  if (!collections.length) {
    throw new Error("No collections found for this project");
  }

  const generated = await GeneratedFile.findOne({projectId});

  if (!generated) {
    throw new Error("Base project files not found");
  }

  let files = generated.files;

  // 🔥 Loop through all collections
  for (const collection of collections) {
    const {collectionName, fields, protect} = collection;

    // ✅ Remove old files of this collection
    files = files.filter((file) => !file.path.includes(`/${collectionName}`));

    // ✅ Generate new files
    const newFiles = generateCollectionFiles(collectionName, fields, protect);

    // ✅ Merge
    files = [...files, ...newFiles];

    // ✅ Update collection
    collection.isGenerated = true;
    collection.lastGeneratedAt = new Date();
    await collection.save();
  }

  // ✅ Save final result
  generated.files = files;
  await generated.save();

  return true;
};
