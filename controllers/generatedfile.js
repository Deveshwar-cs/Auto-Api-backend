import fs from "fs";
import path from "path";
import archiver from "archiver";
import {asyncHandler} from "../middleware/asyncHandler.js";
import GeneratedFile from "../models/GeneratedFile.js";

export const downloadProjectZip = asyncHandler(async (req, res) => {
  const {projectId} = req.params;

  const generated = await GeneratedFile.findOne({projectId});

  if (!generated) {
    return res.status(404).json({message: "Project files not found"});
  }

  res.setHeader("Content-Disposition", `attachment; filename=${projectId}.zip`);

  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", {
    zlib: {level: 9},
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(res);

  generated.files.forEach((file) => {
    archive.append(file.content, {name: file.path});
  });

  await archive.finalize();
});

export const getGeneratedFiles = asyncHandler(async (req, res) => {
  const {projectId} = req.params;

  const generated = await GeneratedFile.findOne({projectId});

  if (!generated) {
    return res.status(404).json({message: "Files not found"});
  }

  res.status(200).json({
    success: true,
    files: generated.files,
  });
});
