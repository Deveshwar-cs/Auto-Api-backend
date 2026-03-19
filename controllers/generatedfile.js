import fs from "fs";
import path from "path";
import archiver from "archiver";
import {asyncHandler} from "../middleware/asyncHandler.js";
// I have implemented recursive directory traversal in Node.js using fs and path.

export const downloadProjectZip = asyncHandler(async (req, res) => {
  const {projectId} = req.params;

  const projectPath = path.join("generated", projectId);

  if (!fs.existsSync(projectPath)) {
    return res.status(404).json({message: "Project folder not found"});
  }

  res.setHeader(
    "Content-Disposition",
    `attachement; filename=${projectId}.zip`,
  );

  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", {
    zlib: {level: 9},
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(res);

  archive.directory(projectPath, false);
  await archive.finalize();
});

function readAllFiles(dirPath, allFiles = []) {
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isFile()) {
      const code = fs.readFileSync(itemPath, "utf-8");
      allFiles.push({
        fileName: item,
        code,
      });
    } else if (stat.isDirectory()) {
      readAllFiles(itemPath, allFiles); // recursion
    }
  });

  return allFiles;
}

export const getGeneratedFiles = (req, res) => {
  try {
    const {projectId} = req.params;
    const projectPath = path.join("generated", projectId);

    if (!fs.existsSync(projectPath)) {
      return res.status(404).json({message: "Project folder not found"});
    }

    const allFiles = readAllFiles(projectPath);

    res.json({files: allFiles});
  } catch (err) {
    console.log("ERROR =>", err);
    res.status(500).json({message: "Failed to read generated files"});
  }
};
