import {asyncHandler} from "../middleware/asyncHandler.js";
import Collection from "../models/Collection.js";
import {
  createCollectionService,
  deleteCollectionService,
  updateCollectionService,
  getCollectionsService,
  generateFilesService,
} from "../services/collection.service.js";

export const generateFiles = asyncHandler(async (req, res) => {
  const {projectId, collId} = req.params;
  const collection = await Collection.findById(collId);
  if (!collection) {
    return res.status(404).json({message: "Collection not Found!"});
  }

  await generateFilesService(projectId, collId, req.user._id);

  collection.isGenerated = true;
  collection.lastGeneratedAt = new Date();
  await collection.save();
  res.status(200).json({
    success: true,
    message: "Files generated successfully",
  });
});

export const createCollection = asyncHandler(async (req, res) => {
  const {projectId} = req.params;
  const {collectionName, fields} = req.body;

  const collection = await createCollectionService(
    projectId,
    collectionName,
    fields,
  );

  res.status(201).json({
    success: true,
    data: collection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const {projectId, collId} = req.params;

  await deleteCollectionService(projectId, collId, req.user._id);

  res.status(200).json({
    success: true,
    message: "Collection deleted successfully",
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const {projectId, collId} = req.params;
  const {collectionName, fields} = req.body;

  const updatedCollection = await updateCollectionService(
    projectId,
    collId,
    collectionName,
    fields,
  );

  updatedCollection.isGenerated = false;
  await updatedCollection.save();

  res.status(200).json({
    success: true,
    data: updatedCollection,
  });
});

export const getCollections = asyncHandler(async (req, res) => {
  const {projectId} = req.params;

  const collections = await getCollectionsService(projectId, req.user._id);

  res.status(200).json({
    success: true,
    data: collections,
  });
});
