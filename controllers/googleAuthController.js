import {OAuth2Client} from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {asyncHandler} from "../middleware/asyncHandler.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = asyncHandler(async (req, res) => {
  const {token} = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  const {email, name, picture} = payload;

  let user = await User.findOne({email});

  if (!user) {
    user = await User.create({
      name,
      email,
      profilePic: picture,
      password: null,
      googleAuth: true,
    });
  }

  const jwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    token: jwtToken,
    user,
  });
});
