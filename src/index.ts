import express from "express";
import morgan from "morgan";
import config from "./config/config";
import cors from "cors";
import passport from "passport";
import "./config/passport";
import cookieParser from "cookie-parser";
import DBConnection from "./config/db";
import globalErrorHandling from "./utils/globalsErrorHandling";
import { notFoundHandler } from "./middlewares/notfound";

//router
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import astrologyRoutes from "./routes/astrology.routes";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

DBConnection();

const PORT = config.PORT || 3000;
app.use(passport.initialize());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/astrology", astrologyRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandling);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
