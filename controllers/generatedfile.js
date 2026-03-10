import fs from "fs";
import path from "path";
// I have implemented recursive directory traversal in Node.js using fs and path.

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
