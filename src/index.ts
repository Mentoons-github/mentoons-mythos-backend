import express from "express";
import morgan from "morgan";
import config from "./config/config";
import DBConnection from "./config/db";
import globalErrorHandling from "./utils/globalsErrorHandling";
import { notFoundHandler } from "./middlewares/notfound";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBConnection();

const PORT = config.PORT || 3000;
app.use(globalErrorHandling);
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
