import express from "express";
import morgan from "morgan";
import config from "./config/config";
import cors from "cors";
import DBConnection from "./config/db";
import globalErrorHandling from "./utils/globalsErrorHandling";
import { notFoundHandler } from "./middlewares/notfound";
import authRoutes from './routes/userRoutes'

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

DBConnection();

const PORT = config.PORT || 3000;

app.use('/api/v1/auth/',authRoutes)

app.use(notFoundHandler);
app.use(globalErrorHandling);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
 