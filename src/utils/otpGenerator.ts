import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
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
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
    from: process.env.EMAIL!,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
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

export const verifyOTP = (email: string, otp: string): boolean => {
  const record = otpStore.get(email);
  if (!record) return false;

  const { otp: storedOtp, expiresAt } = record;
  const valid = otp === storedOtp && Date.now() < expiresAt;

  if (valid) otpStore.delete(email); // OTP used, remove it

  return valid;
};

