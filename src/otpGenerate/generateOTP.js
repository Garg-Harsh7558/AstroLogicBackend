import crypto from "crypto";

function generateOTP() {
  // Generates a number between 100,000 and 999,999
  const otp = crypto.randomInt(100000, 1000000); 
  return otp.toString();
}

console.log("otp sample is",generateOTP()); // Example: "482910"
export default generateOTP;