import express from "express";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchProducts,
  fetchSingleProduct,
} from "../controllers/productController";
import userAuth from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const routes = express.Router();

routes.get("/", fetchProducts);
routes.get("single/:productId", fetchSingleProduct);
routes.post("/add", userAuth, adminMiddleware, addNewProduct);
routes.patch("/edit/:productId", userAuth, adminMiddleware, editProduct);
routes.delete("/delete/:productId", userAuth, adminMiddleware, deleteProduct);

export default routes;
