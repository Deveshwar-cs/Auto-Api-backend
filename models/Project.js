import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    projectName: {
      type: String,
      required: true,
    },
    collectionsCount: {
      type: Number,
      default: 0,
    },
    mongoUri: String,
    jwtSecret: String,
    port: Number,
    apiPrefix: {type: String, default: "/api"},
    enableAuth: {type: Boolean, default: true},
    enableCors: {type: Boolean, default: false},
    enableLogger: {type: Boolean, default: false},
  },
  {timestamps: true},
);

export default mongoose.model("Project", projectSchema);
