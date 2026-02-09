import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  required: {
    type: Boolean,
    default: false,
  },

  enum: {
    type: [String], // for enum values
  },

  ref: {
    type: String, // for ObjectId reference model name
  },

  default: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const collectionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    collectionName: {
      type: String,
      required: true,
    },

    fields: [fieldSchema],
  },
  {timestamps: true},
);

export default mongoose.model("collection", collectionSchema);
