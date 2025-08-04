import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  PROKERALA_CLIENT_ID: process.env.PROKERALA_CLIENT_ID,
  PROKERALA_CLIENT_SECRET: process.env.PROKERALA_CLIENT_SECRET,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_REGION: process.env.AWS_REGION!,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME!,
  CCAVENUE_MERCHANT_ID: process.env.CCAVENUE_MERCHANT_ID!,
  CCAVENUE_WORKING_KEY: process.env.CCAVENUE_WORKING_KEY!,
  CCAVENUE_ACCESS_CODE: process.env.CCAVENUE_ACCESS_CODE!,
};

export default config;
