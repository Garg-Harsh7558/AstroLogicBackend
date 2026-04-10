import mongoose from "mongoose";
const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    trails: { type: Number, default: 0 },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // OTP expires after 10 minutes
  },
  { timestamps: true },
);

const OtpSchema = mongoose.model("OtpSchema", otpSchema);

export default OtpSchema;
