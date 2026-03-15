import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      requied: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "dark",
    },
  },
  {timestamps: true},
);

export default mongoose.model("Users", userSchema);
