import {asyncHandler} from "../middleware/asyncHandler.js";
import Project from "../models/Project.js";
import Notification from "../models/notificationModel.js";
import GeneratedFile from "../models/GeneratedFile.js";

// ✅ File generators (UPDATED versions that use files[])
import {createAppFile} from "../utils/createAppFile.js";
import {createServerFile} from "../utils/createServerFile.js";
import {createUserModelFile} from "../utils/createUserModelFile.js";
import {createAuthControllerFile} from "../utils/createAuthControllerFile.js";
import {createAuthRoutesFile} from "../utils/createAuthRouteFile.js";
import {createAuthMiddlewareFile} from "../utils/createAuthMiddlewareFile.js";
import {createEnvFile} from "../utils/createEnvFile.js";
import {createPackageJsonFile} from "../utils/createPackageJsonFile.js";
import {createDbFile} from "../utils/createDbFile.js";
import {createErrorMiddlewareFile} from "../utils/createErrorMiddleware.js";
import {createAsyncMiddlewareFile} from "../utils/createAsyncMiddleware.js";
import {createSwaggerFile} from "../utils/createSwaggerFile.js";

/* =========================
   CREATE PROJECT
========================= */
export const createProject = asyncHandler(async (req, res) => {
  const {
    projectName,
    port,
    mongoUri,
    jwtSecret,
    apiPrefix,
    enableAuth,
    enableCors,
    enableLogger,
  } = req.body;

  if (!projectName) {
    return res.status(400).json({message: "Project name is required"});
  }

  // ✅ Create project in DB
  const project = await Project.create({
    userId: req.user._id,
    projectName,
    port,
    mongoUri,
    jwtSecret,
    apiPrefix,
    enableAuth,
    enableCors,
    enableLogger,
  });

  // ✅ Virtual file system
  const files = [];

  createAppFile(files, project);
  createServerFile(files);
  createDbFile(files);
  createSwaggerFile(files);
  createErrorMiddlewareFile(files);
  createAsyncMiddlewareFile(files);

  if (enableAuth) {
    createUserModelFile(files);
    createAuthControllerFile(files);
    createAuthRoutesFile(files);
    createAuthMiddlewareFile(files);
  }

  createEnvFile(files, project);
  createPackageJsonFile(files);

  // ✅ Save generated files in MongoDB
  await GeneratedFile.create({
    projectId: project._id,
    files,
  });

  /* 🔔 Notification */
  const notification = await Notification.create({
    user: req.user._id,
    message: `Project "${project.projectName}" created`,
    type: "PROJECT_CREATED",
    read: false,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(notification.user.toString()).emit("newNotification", notification);
  }

  res.status(201).json(project);
});

/* =========================
   GET PROJECTS
========================= */
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({userId: req.user._id});
  res.status(200).json(projects);
});

/* =========================
   UPDATE PROJECT
========================= */
export const updateProject = asyncHandler(async (req, res) => {
  const {id} = req.params;

  const updatedProject = await Project.findOneAndUpdate(
    {_id: id, userId: req.user._id},
    {$set: req.body},
    {new: true},
  );

  if (!updatedProject) {
    return res
      .status(404)
      .json({message: "Project not found or not authorized"});
  }

  // ✅ Regenerate files
  const files = [];

  createAppFile(files, updatedProject);
  createServerFile(files);
  createDbFile(files);
  createSwaggerFile(files);
  createErrorMiddlewareFile(files);
  createAsyncMiddlewareFile(files);

  if (updatedProject.enableAuth) {
    createUserModelFile(files);
    createAuthControllerFile(files);
    createAuthRoutesFile(files);
    createAuthMiddlewareFile(files);
  }

  createEnvFile(files, updatedProject);
  createPackageJsonFile(files);

  // ✅ Update DB files
  await GeneratedFile.findOneAndUpdate(
    {projectId: id},
    {files},
    {upsert: true, new: true},
  );

  /* 🔔 Notification */
  const notification = await Notification.create({
    user: req.user._id,
    message: `Project "${updatedProject.projectName}" updated`,
    type: "PROJECT_UPDATED",
    read: false,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(notification.user.toString()).emit("newNotification", notification);
  }

  res.status(200).json({
    message: "Project updated successfully",
    project: updatedProject,
  });
});

/* =========================
   DELETE PROJECT
========================= */
export const deleteProject = asyncHandler(async (req, res) => {
  const {id} = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return res.status(400).json({message: "Project not found"});
  }

  if (project.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({message: "Not authorized"});
  }

  // ✅ Delete generated files from DB
  await GeneratedFile.deleteOne({projectId: id});

  // ✅ Delete project
  await project.deleteOne();

  /* 🔔 Notification */
  const notification = await Notification.create({
    user: req.user._id,
    message: `Project "${project.projectName}" deleted`,
    type: "PROJECT_DELETED",
    read: false,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(notification.user.toString()).emit("newNotification", notification);
  }

  res.status(200).json({message: "Project deleted successfully"});
});
