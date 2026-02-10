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
import {deleteAuthFiles} from "../utils/deleteAuthFiles.js";
import fs, {rmSync} from "fs";

// Create Project
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
  console.log(port);
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

// Update project:
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

  // 🔁 Regenerate files using UPDATED data from DB
  const projectPath = path.join("generated", id.toString());

  if (oldProject.enableAuth && !updatedProject.enableAuth) {
    deleteAuthFiles(projectPath);
  }

  createAppFile(projectPath, updatedProject);
  createServerFile(projectPath);
  createDbFile(projectPath);
  createErrorMiddlewareFile(projectPath);

  if (!oldProject.enableAuth && updatedProject.enableAuth) {
    createUserModelFile(projectPath);
    createAuthControllerFile(projectPath);
    createAuthRoutesFile(projectPath);
    createAuthMiddlewareFile(projectPath);
  }

  createEnvFile(projectPath, updatedProject);
  createPackageJsonFile(projectPath);

  res.status(200).json({
    message: "Project updated successfully",
    project: updatedProject,
  });
});

// delete Project:
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
