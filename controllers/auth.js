import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {asyncHandler} from "../middleware/asyncHandler.js";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  const userExists = await User.findOne({email});
  if (userExists) {
    return res.status(400).json({
      message: "User aready exists with this email",
    });
  }
  const hashedPassowrd = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassowrd,
  });
  res.status(201).json({
    message: "User registered successfully",
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user)
    return res.status(400).json({messsage: "Invalid email or password"});

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(400).json({messsage: "Invalid email or password"});

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({message: "Login successful", token});
});
