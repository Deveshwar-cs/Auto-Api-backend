import {asyncHandler} from "../middleware/asyncHandler.js";
import Notification from "../models/notificationModel.js";
import Collection from "../models/Collection.js";
import {
  createCollectionService,
  deleteCollectionService,
  updateCollectionService,
  getCollectionsService,
  generateFilesService,
  generateAllCollectionsService,
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

  const notification = await Notification.create({
    user: req.user._id,
    message: `Collection "${collection.collectionName}" created`,
    read: false,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(notification.user.toString()).emit("newNotification", notification);
  }

  res.status(201).json({
    success: true,
    data: collection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const {projectId, collId} = req.params;

  const currentCollection = await Collection.findById(collId);
  await deleteCollectionService(projectId, collId, req.user._id);

  const notification = await Notification.create({
    user: req.user._id,
    message: `Collection "${currentCollection.collectionName}" deleted`,
    read: false,
  });
  const io = req.app.get("io");
  if (io) {
    io.to(notification.user.toString()).emit("newNotification", notification);
  }
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
  const collection = await Collection.findById(collId);

  updatedCollection.isGenerated = false;
  await updatedCollection.save();

  const notification = await Notification.create({
    user: req.user._id,
    message: `Collection "${collection.collectionName}" updated`,
    read: false,
  });
  const io = req.app.get("io");
  if (io) {
    io.to(notification.user.toString()).emit("newNotification", notification);
  }

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

export const generateAllCollections = asyncHandler(async (req, res) => {
  const {projectId} = req.params;

  await generateAllCollectionsService(projectId, req.user.id);

  res.json({
    success: true,
    message: "All collections generated successfully",
  });
});
