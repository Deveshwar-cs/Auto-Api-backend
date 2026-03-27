import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const generatedFileSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },
    files: [fileSchema],
  },
  {timestamps: true},
);
export default mongoose.model("GeneratedFile", generatedFileSchema);
