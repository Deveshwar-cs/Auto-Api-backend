import mongoose, {Mongoose} from "mongoose";

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  // Main field type
  type: {
    type: String,
    required: true,
    enum: ["String", "Number", "Boolean", "Date", "ObjectId", "Array"],
  },

  required: {
    type: Boolean,
    default: false,
  },

  // ✅ For enum on String
  enum: {
    type: [mongoose.Schema.Types.Mixed],
  },

  // ✅ For ObjectId reference
  ref: {
    type: String,
  },

  // ✅ NEW: for Array type (what it contains)
  itemsType: {
    type: String,
    enum: ["String", "Number", "Boolean", "Date", "ObjectId"],
  },

  // default value
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
