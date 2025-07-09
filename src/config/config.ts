import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

export default config;
