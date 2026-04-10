import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import OtpSchema from "../models/otpemail.model.js";
import messagecontext from "../verifyuser/mailsmaple.js";
import sendmail from "../verifyuser/sendmail.js";
import generateOTP from "../otpGenerate/generateOTP.js";
import transporter from "../verifyuser/sendmail.js";

const salt = bcrypt.genSaltSync(10);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// registration logic
const register = async (req, res) => {
try { const { username="null", email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json(`All fields are required`);
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json(`Invalid email format`);
  }

  const user = await User.findOne({ username: username });
  const user2 = await User.findOne({ email: email });
  if (user || user2) {
    return res
      .status(400)
      .json(`Username and email must be unique. User already exists`);
  }
  req.body.password = bcrypt.hashSync(password, salt);
  const newUser = await User.create({email,username,password:req.body.password});

  return res.status(201).json({
    message: "User registered successfully ,verify your email",
    user: newUser,
  });}catch(error){return res.status(500).json(`Internal server error in register`)}
};
// verification of email and sending otp
const verifyEmail = async (req, res) => {
  try{
  const { email, username } = req.body;

  if (!email && !username) {
    return res.status(400).json("Email or username is required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    return res.status(400).json("User not found. Please register first");
  }

  if (user.isVerified) {
    return res.status(400).json("User is already verified");
  }

  const otpCode = generateOTP();
  const hashedOtp = await bcrypt.hash(otpCode, salt);

  await OtpSchema.deleteOne({ email: user.email });
  const createotpondb = await OtpSchema.create({
    email: user.email,
    otp: hashedOtp,
  });

  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Transporter verification failed:", err);
    return res.status(500).json({ message: "Email service is not available" });
  }

  try {
    await transporter.sendMail(messagecontext(user, otpCode));
    return res.status(200).json({ message: "Verification OTP sent to email" });
  } catch (err) {
    console.error("Error sending email:", err);
    return res
      .status(500)
      .json({ message: "Failed to send verification email" });
  }}catch(err){res.status(500).json(`Internal server error in verifyEmail`)}
};
// verification of otp
const verifyOtp = async (req, res) => {
  try{
  const { email, username, otpCode } = req.body;

  if ((!email && !username) || !otpCode) {
    return res.status(400).json("Email/username and OTP code are required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    return res.status(400).json("User not found");
  }

  const otpRecord = await OtpSchema.findOne({ email: user.email });
  if (!otpRecord) {
    return res
      .status(400)
      .json("OTP record not found. Please request a new OTP");
  }

  const isOtpValid = await bcrypt.compare(otpCode, otpRecord.otp);
  if (!isOtpValid) {
    return res.status(400).json("Invalid OTP. Please try again");
  }

  user.isVerified = true;
  await user.save();
  await OtpSchema.deleteOne({ email: user.email });

  return res
    .status(200)
    .json({ message: "Email verified successfully. You can now log in." });
}catch(err){res.status(500).json(`Internal server error in verifyOtp`)}
};
// login logic
const login = async (req, res) => {
  try{const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    return res.status(400).json(`credentials required`);
  }
  const user = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (!user) {
    return res.status(400).json(`User not found. Please register first`);
  }
  if(!user.isVerified){
    return res.status(400).json(`User is not verified. Please verify your email first`);
  }
  const hashpassword = user.password;
  const isMatched = await bcrypt.compare(password, hashpassword);
  if (!isMatched) {
    return res.status(400).json(`Invalid credentials`);
  }
// jwt token generation with 7 days expiry
  const token = jwt.sign({ _id: user._id }, process.env.jwt_secret, {
    expiresIn: "7d",
  });
  user.loginToken = token;
  await user.save();
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true, // Protects against XSS (JS can't read it)
      secure: true, // Only sent over HTTPS (use false for localhost testing)
      sameSite: "Strict", // Protects against CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    })
    .json({ success: true, message: "Logged in successfully!" });
  }catch(err){res.status(500).json(`Internal server error in login`)}

  // pending logic for jwt comparison and cookie handling
};
// forgot password logic
const forgotPassword = async (req, res) => {
  try{
  const { email, username } = req.body;
  if (!email && !username) {
    return res.status(400).json(`Email or username is required`);
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    return res.status(400).json(`User not found. Please register first`);
  }
  if(!user.isVerified){
    return res.status(400).json(`User is not verified. Please verify your email first`);
  }
  const otpForPasswordReset = generateOTP();
  const hashedOtpForPasswordReset = await bcrypt.hash(otpForPasswordReset, salt);
await OtpSchema.deleteOne({ email: user.email }); 
const createotpondb = await OtpSchema.create({
    email: user.email,
    otp: hashedOtpForPasswordReset,
  });
  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Transporter verification failed:", err);
    return res.status(500).json({ message: "Email service is not available" });
  }   
  try { await transporter.sendMail(messagecontext(user, otpForPasswordReset));
    return res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (err) { 
    console.error("Error sending email:", err);
    return res
      .status(500)
      .json({ message: "Failed to send password reset email" });
  }}catch(err){res.status(500).json(`Internal server error in forgotPassword`)}
};
// verify otp for password reset and update password
const verifyOtpForPasswordReset = async (req, res) => {
  try{
  const { email, username, password ,otpCode } = req.body;

  if ((!email && !username) || !otpCode || !password) {
    return res.status(400).json("Email/username, OTP code, and new password are required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    return res.status(400).json("User not found");
  }

  const otpRecord = await OtpSchema.findOne({ email: user.email });
  if (!otpRecord) {
    return res
      .status(400)
      .json("OTP record not found. Please request a new OTP");
  }

  const isOtpValid = await bcrypt.compare(otpCode, otpRecord.otp);
  if (!isOtpValid) {
    return res.status(400).json("Invalid OTP. Please try again");
  }

  user.password = bcrypt.hashSync(password, salt);
  await user.save();
  await OtpSchema.deleteOne({ email: user.email });
  return res
    .status(200)
    .json({ message: "Password reset successfully. You can now log in with your new password." });
}catch(err){res.status(500).json(`Internal server error in verifyOtpForPasswordReset`)}
};
  //logout logic
  const logout=async(req,res)=>{
    try{
    const{token}=req.cookies;
    if(!token){
      return res.status(400).json(`user not logged in`);
    }
    try {await User.findOneAndUpdate({loginToken:token},{$set:{loginToken:null}});
    res.clearCookie("token");
    return res.status(200).json({message:"Logged out successfully"});
  } catch(err){
    console.error("Error during logout:", err);
    return res.status(500).json({ message: "Failed to log out" });
  }}catch(err){res.status(500).json(`Internal server error in logout`)}
}
//exporting functions
export { register, login, verifyEmail, verifyOtp, forgotPassword, verifyOtpForPasswordReset ,logout};
// apply parent try catch to all functions