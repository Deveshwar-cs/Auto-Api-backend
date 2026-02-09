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
    mongoUri: String,
    jwtSecret: String,
    apiPrefix: {type: String, default: "/api"},
    enableAuth: {type: Boolean, default: true},
    enableCors: {type: Boolean, default: false},
    enableLogger: {type: Boolean, default: false},
  },
  {timestamps: true},
);

export default mongoose.model("Project", projectSchema);
