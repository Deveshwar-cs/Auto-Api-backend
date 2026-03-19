import Collection from "../models/Collection.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";
import {sanitizeFields} from "../utils/sanitizeFields.js";
import {
  generateCollectionFiles,
  deleteCollectionFiles,
} from "./fileGenerator.service.js";

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

  generateCollectionFiles(
    projectId,
    collection.collectionName,
    collection.fields,
    collection.protect,
  );

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

  for (const collection of collections) {
    generateCollectionFiles(
      projectId,
      collection.collectionName,
      collection.fields,
      collection.protect,
    );

    collection.isGenerated = true;
    collection.lastGeneratedAt = new Date();
    await collection.save();
  }

  return true;
};
