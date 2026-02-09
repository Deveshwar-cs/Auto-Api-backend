import fs from "fs";
import path from "path";

export const getGeneratedFiles = (req, res) => {
  try {
    const {projectId} = req.params;

    const projectPath = path.join("generated", projectId);

    if (!fs.existsSync(projectPath)) {
      return res.status(404).json({message: "Project folder not found"});
    }

    let allFiles = [];

    const items = fs.readdirSync(projectPath);

    items.forEach((item) => {
      const itemPath = path.join(projectPath, item);
      const stat = fs.statSync(itemPath);

      // If direct file like .env
      if (stat.isFile()) {
        const code = fs.readFileSync(itemPath, "utf-8");
        allFiles.push({
          fileName: item,
          code,
        });
      }

      // If collection folder
      if (stat.isDirectory()) {
        const files = fs.readdirSync(itemPath);

        files.forEach((file) => {
          const filePath = path.join(itemPath, file);
          const fileStat = fs.statSync(filePath);

          if (fileStat.isFile()) {
            const code = fs.readFileSync(filePath, "utf-8");
            allFiles.push({
              fileName: file,
              code,
            });
          }
        });
      }
    });

    res.json({files: allFiles});
  } catch (err) {
    console.log("ERROR =>", err);
    res.status(500).json({message: "Failed to read generated files"});
  }
};
