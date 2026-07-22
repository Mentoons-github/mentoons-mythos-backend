import { IProducts } from "../interfaces/productInterface";
import Product from "../models/productModel";
import CustomError from "../utils/customError";

//fetch products
export const fetchProducts = async () => {
  return await Product.find();
};

//fetch single product
export const fetchSingleProduct = async (productId: string) => {
  if (!productId) throw new CustomError("Product id required", 400);
  return await Product.findById(productId);
};

//add new product
export const addNewProduct = async (productData: IProducts) => {
  const newProduct = await Product.create(productData);
  return newProduct;
};

//edit product
export const editProduct = async (
  productData: IProducts,
  productId: string,
) => {
  const {
    title,
    pages,
    thumbnails,
    price,
    size,
    data,
    description,
    offerPrice,
  } = productData;
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      title,
      pages,
      thumbnails,
      price,
      size,
      data,
      description,
      offerPrice,
    },
    { new: true },
  );

  return updatedProduct;
};

// delete product
export const deleteProduct = async (productId: string) => {
  await Product.findByIdAndDelete(productId);
};
