import nodemailer from 'nodemailer';
import config from '../config/config';


export const generateOTP = (length = 6): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];

  }

  console.log(otp,'otpppppppp')
  return otp;
};
 

export const sendOTPEmail = async (email: string, otp: string) => {
    console.log(email,otp,'email and otp')
    console.log(config.EMAIL_USER,'user')
    console.log(config.EMAIL_PASS,'passss')

  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",         
  port: 465,                      
  secure: true, 
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
}); 

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Failed to connect to Gmail:", err);
  } else {
    console.log("✅ Email server is ready"); 
  }
}); 
 
 const mailOptions = {
  from: `"MentoonsMythos Team" <${process.env.EMAIL!}>`, 
  to: email,
  subject: 'Your OTP Code',
  text: `Your OTP is: ${otp}`, 
  html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 10px; width: 100%; max-width: 500px; margin: auto;">
      <h2 style="color: #333;">MentoonsMythos Verification Code</h2>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">
        Your OTP code is:
      </p>
      <h1 style="background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-align: center; width: fit-content;">
        ${otp}
      </h1>
      
      <hr style="margin: 20px 0;" />
      <p style="font-size: 12px; color: #bbb;">If you did not request this, please ignore this email.</p>
    </div>
  `,
};


  await transporter.sendMail(mailOptions);
};


type OTPRecord = {
  otp: string;
  expiresAt: number;
};

const otpStore = new Map<string, OTPRecord>();

export const saveOTP = (email: string, otp: string, ttlMinutes = 5) => {
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });
};

export const verifyOTP = (
  email: string,
  otp: string
): { status: 'valid' | 'expired' | 'invalid' } => {
  const record = otpStore.get(email);
  if (!record) return { status: 'invalid' };

  const { otp: storedOtp, expiresAt } = record;

  if (Date.now() > expiresAt) {
    otpStore.delete(email); // cleanup expired
    return { status: 'expired' };
  }

  if (otp !== storedOtp) {
    return { status: 'invalid' };
  }

  otpStore.delete(email); // valid and used
  return { status: 'valid' };
};


