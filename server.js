import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import errorHandler from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import generatedFilesRoutes from "./routes/generatedFiles.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("All things are working fine!!");
});
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/generated-files", generatedFilesRoutes);

app.use(errorHandler);

app.listen(5001, () => console.log("Server running on port 5001"));
