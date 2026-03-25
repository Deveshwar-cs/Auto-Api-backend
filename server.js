import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import {Server} from "socket.io";

import errorHandler from "./middleware/errorMiddleware.js";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import generatedFilesRoutes from "./routes/generatedFiles.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import settingRoutes from "./routes/settingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

/* Create HTTP server for socket */
const server = http.createServer(app);

/* Socket.io setup */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    origin: "https://auto-api-frontend-git-main-logic-lords.vercel.app/",
    methods: ["GET", "POST", "PUT"],
  },
});

/* Make io accessible in controllers */
app.set("io", io);

/* Middleware */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* MongoDB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* Test Route */
app.get("/", (req, res) => {
  res.send("All things are working fine!!");
});

/* API Routes */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/generated-files", generatedFilesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/notifications", notificationRoutes);

/* Global Error Handler */
app.use(errorHandler);

/* Socket connection */

io.on("connection", (socket) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("No token provided");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    socket.join(userId);

    console.log("User joined room:", userId);
  } catch (err) {
    console.log("Invalid token");
  }

  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
/* Start server */
const PORT = 5001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
