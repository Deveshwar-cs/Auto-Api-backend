import express from "express";
import {login, register} from "../controllers/auth.js";
import {googleLogin} from "../controllers/googleAuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

export default router;
