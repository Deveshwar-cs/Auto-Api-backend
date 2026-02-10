import path from "path";
import fs from "fs";
export const deleteAuthFiles = (projectPath) => {
  const paths = [
    "models/User.model.js",
    "controllers/auth.Controller.js",
    "routes/auth.Routes.js",
    "middleware/authMiddleware.js",
  ];

  paths.forEach((p) => {
    const full = path.join(projectPath, p);
    if (fs.existsSync(full)) {
      fs.rmSync(full, {force: true});
    }
  });
};
