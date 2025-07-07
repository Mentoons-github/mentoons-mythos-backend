import mongoose from "mongoose";
import config from "./config";

const DBConnection = async () => {
  try {
    await mongoose.connect(config.MONGO_URI!);
    console.log("mongoDB connected");
  } catch (error) {
    console.log("error from mongodb connection :", error);
    process.exit(1);
  }
};

export default DBConnection;
