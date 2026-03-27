import {asyncHandler} from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

// ================= GET PROFILE =================
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ================= UPDATE PROFILE =================
export const updateProfile = asyncHandler(async (req, res) => {
  const {name, bio} = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({message: "User not found"});
  }

  // 🔥 If new image uploaded
  if (req.file) {
    // 🔥 Delete old image from Cloudinary
    if (user.profilePhoto) {
      const publicId = user.profilePhoto.split("/").pop().split(".")[0];

      try {
        await cloudinary.uploader.destroy(`autoapi_uploads/${publicId}`);
      } catch (err) {
        console.log("Cloudinary delete failed:", err.message);
      }
    }

    // 🔥 Save Cloudinary URL
    user.profilePhoto = req.file.path;
  }

  user.name = name || user.name;
  user.bio = bio || user.bio;

  const updatedUser = await user.save();

  res.json(updatedUser);
});

// ================= UPDATE THEME =================
export const updateTheme = asyncHandler(async (req, res) => {
  const {theme} = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, {theme}, {new: true});

  res.json({theme: user.theme});
});

// ================= CHANGE PASSWORD =================
export const changePassword = asyncHandler(async (req, res) => {
  const {currentPassword, newPassword} = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({message: "All fields are required"});
  }

  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({message: "Wrong current password"});
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
  });
});
