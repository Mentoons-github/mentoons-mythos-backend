import express from "express";
import morgan from "morgan";
import config from "./config/config";

const app = express();
app.use(morgan("dev"));

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
