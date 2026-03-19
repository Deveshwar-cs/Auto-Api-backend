import {asyncHandler} from "../middleware/asyncHandler.js";
import Project from "../models/Project.js";
import Notification from "../models/notificationModel.js";

import path from "path";
import fs from "fs";

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
import {deleteAuthFiles} from "../utils/deleteAuthFiles.js";
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

  const projectPath = path.join("generated", project._id.toString());

  createAppFile(projectPath, project);
  createServerFile(projectPath);
  createDbFile(projectPath);
  createSwaggerFile(projectPath);
  createErrorMiddlewareFile(projectPath);
  createAsyncMiddlewareFile(projectPath);

  if (enableAuth) {
    createUserModelFile(projectPath);
    createAuthControllerFile(projectPath);
    createAuthRoutesFile(projectPath);
    createAuthMiddlewareFile(projectPath);
  }

  createEnvFile(projectPath, project);
  createPackageJsonFile(projectPath);

  /* Create Notification */
  const notification = await Notification.create({
    user: req.user._id,
    message: `Project "${project.projectName}" created`,
    read: false,
  });

  /* Emit socket event */
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

  const oldProject = await Project.findById(id);

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

  const projectPath = path.join("generated", id.toString());

  if (oldProject.enableAuth && !updatedProject.enableAuth) {
    deleteAuthFiles(projectPath);
  }

  createAppFile(projectPath, updatedProject);
  createServerFile(projectPath);
  createDbFile(projectPath);
  createSwaggerFile(projectPath);
  createErrorMiddlewareFile(projectPath);
  createAsyncMiddlewareFile(projectPath);

  if (!oldProject.enableAuth && updatedProject.enableAuth) {
    createUserModelFile(projectPath);
    createAuthControllerFile(projectPath);
    createAuthRoutesFile(projectPath);
    createAuthMiddlewareFile(projectPath);
  }

  createEnvFile(projectPath, updatedProject);
  createPackageJsonFile(projectPath);

  /* Create Notification */
  const notification = await Notification.create({
    user: req.user._id,
    message: `Project "${updatedProject.projectName}" updated`,
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

  const projectPath = path.join("generated", id);

  if (fs.existsSync(projectPath)) {
    fs.rmSync(projectPath, {recursive: true, force: true});
  }

  await project.deleteOne();

  /* Create Notification */
  const notification = await Notification.create({
    user: req.user._id,
    message: `Project "${project.projectName}" deleted`,
    read: false,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(notification.user.toString()).emit("newNotification", notification);
  }

  res.status(200).json({message: "Project deleted successfully"});
});
