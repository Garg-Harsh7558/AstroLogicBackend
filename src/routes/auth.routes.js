import {
  register,
  login,
  verifyEmail,
  verifyOtp,
  forgotPassword,
  verifyOtpForPasswordReset,
  logout,
} from "../controllers/auth.controllers.js";

import express from "express";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp-for-password-reset", verifyOtpForPasswordReset);
router.post("/logout", logout);

export default router;
