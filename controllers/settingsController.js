import {asyncHandler} from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const {name, bio} = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({message: "User not found"});
  }

  // If new photo uploaded
  if (req.file) {
    // Delete old photo
    if (user.profilePhoto) {
      const oldImagePath = path.join("uploads", user.profilePhoto);

      try {
        await fs.promises.unlink(oldImagePath);
      } catch (error) {
        console.log("Old image not found or already deleted");
      }
    }

    // Save new filename
    user.profilePhoto = req.file.filename;
  }

  // Update other fields
  user.name = name || user.name;
  user.bio = bio || user.bio;

  const updatedUser = await user.save();

  res.json(updatedUser);
});

export const updateTheme = asyncHandler(async (req, res) => {
  const {theme} = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, {theme}, {new: true});
  res.json({theme: user.theme});
});

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
