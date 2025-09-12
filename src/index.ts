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
import upload from "./middlewares/multer";
import { createServer } from "http";
import { setupSocket } from "./socket/socket";

//router
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import blogRoutes from "./routes/blog.routes";
import uploadRoutes from "./routes/upload.routes";
import astrologyRoutes from "./routes/astrology.routes";
import chatRoutes from "./routes/chat.routes";
import assessmentRoutes from "./routes/assessment.route";
import paymentRoutes from "./routes/payment.routes";
import careerRoutes from './routes/career.route'
import bookCallRoutes from './routes/bookCall.routes'
import workshopRoutes from './routes/workshop.route'
import Report_BlockRoutes from './routes/report-block.routes'

//employee router
import employeeRoutes from "./routes/employee.routes";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      config.FRONTEND_URL,
      "https://mentoonsmythos.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: [
      "Cross-Origin-Opener-Policy",
      "Cross-Origin-Resource-Policy",
      "Access-Control-Allow-Origin",
    ],
    credentials: true,
  })
);

DBConnection();

const PORT = config.PORT || 3000;
app.use(passport.initialize());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/astrology", astrologyRoutes);
app.use("/api/v1/upload", upload.any(), uploadRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/assessment", assessmentRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/career", careerRoutes)
app.use("/api/v1/book-call", bookCallRoutes)
app.use("/api/v1/workshop", workshopRoutes)
app.use("/api/v1/report-block", Report_BlockRoutes)

//employee
app.use("/api/v1/employee", employeeRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandling);

const server = createServer(app);

setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
