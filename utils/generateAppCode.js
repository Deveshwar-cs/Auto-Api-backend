export const generateAppCode = (project) => {
  return `
import express from "express";
import dotenv from "dotenv";
${project.enableCors ? 'import cors from "cors";' : ""}
${project.enableLogger ? 'import morgan from "morgan";' : ""}
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

app.use(express.json());
${project.enableCors ? "app.use(cors());" : ""}
${project.enableLogger ? "app.use(morgan('dev'));" : ""}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesPath = path.join(__dirname, "routes");

if (fs.existsSync(routesPath)) {
  fs.readdirSync(routesPath).forEach(async (file) => {
    if (file.endsWith(".routes.js")) {
      const route = await import(\`./routes/\${file}\`);
      const name = file.split(".")[0];
      app.use(\`${project.apiPrefix}/\${name}\`, route.default);
    }
  });
}

app.get("/", (req, res) => res.send("API Running"));
app.use(errorMiddleware);

export default app;
`;
};
