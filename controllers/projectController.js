import {asyncHandler} from "../middleware/asyncHandler.js";
import Project from "../models/Project.js";
import path from "path";
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
import fs from "fs";

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

  // Generate base backend structure for this project
  const projectPath = path.join("generated", project._id.toString());

  // Base files
  createAppFile(projectPath, project);
  createServerFile(projectPath);
  createDbFile(projectPath);
  createErrorMiddlewareFile(projectPath);

  // Optional Auth
  if (enableAuth) {
    createUserModelFile(projectPath);
    createAuthControllerFile(projectPath);
    createAuthRoutesFile(projectPath);
    createAuthMiddlewareFile(projectPath);
  }

  // Env + package
  createEnvFile(projectPath, project);
  createPackageJsonFile(projectPath);

  res.status(201).json(project);
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({userId: req.user._id});

  res.status(200).json(projects);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const {id} = req.params;

  // 1. Find project
  const project = await Project.findById(id);

  if (!project) {
    return res.status(400).json({message: "Project not found"});
  }

  // 2. Check ownership
  if (project.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({message: "Not authorized"});
  }

  // Delete generated folder
  const projectPath = path.join("generated", id);
  if (fs.existsSync(projectPath)) {
    fs.rmSync(projectPath, {recursive: true, force: true});
  }

  // Delete from DB
  await project.deleteOne();
  res.status(200).json({message: "Project deleted successfully"});
});
