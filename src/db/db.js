import mongoose from "mongoose";
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (e) {
    console.error("MongoDB connection failed:", e.message);
    process.exit(1);
  }
};
export default connectDB;
