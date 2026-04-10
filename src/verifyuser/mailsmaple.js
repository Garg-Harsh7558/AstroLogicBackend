const messagecontext = (user, otpCode)=>{
 
 const sample= {
  from: "astrouse7558@gmail.com",
  to: user.email,
  subject: `${otpCode} is your verification code`,
  text: `Your verification code is ${otpCode}. It expires in 10 minutes.`,
  html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc; padding: 40px 0;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <div style="background-color: #0052cc; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Confirm Your Identity</h1>
        </div>

        <div style="padding: 40px; color: #333; line-height: 1.6;">
          <p style="margin-top: 0;">Hi ${user.username},</p>
          <p>Please use the following one-time password (OTP) to complete your verification. This code is valid for <b>10 minutes</b>.</p>
          
          <div style="background-color: #f1f4f9; border-radius: 6px; padding: 20px; text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0052cc;">${otpCode}</span>
          </div>

          <p style="font-size: 13px; color: #666;">
            <strong>Secure tip:</strong> If you didn't request this code, please ignore this email or contact support if you're concerned about your account security.
          </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
          <p style="margin: 0; font-size: 12px; color: #999;">
            &copy; 2026 YourBrand Inc. All rights reserved. <br>
            123 Tech Lane, Silicon Valley, CA.
          </p>
        </div>
      </div>
    </div>
  `
};

return sample;
}
export default messagecontext;