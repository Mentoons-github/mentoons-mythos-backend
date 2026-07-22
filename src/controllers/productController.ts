import * as ProductService from "../services/productService";
import catchAsync from "../utils/cathAsync";

//fetch products
export const fetchProducts = catchAsync(async (req, res) => {
  const products = await ProductService.fetchProducts();
  res.status(200).json({ message: "Products fetched", products });
});

// fetch single product
export const fetchSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const product = await ProductService.fetchSingleProduct(productId);
  res.status(200).json({ message: "Single Product fetched", product });
});

//add new products
export const addNewProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const newProduct = await ProductService.addNewProduct(productData);
  res.status(201).json({ message: "New product added", newProduct });
});

//edit product
export const editProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const { productId } = req.params;
  const updatedProduct = await ProductService.editProduct(
    productData,
    productId,
  );

  res
    .status(200)
    .json({ message: "Product successfully edited", updatedProduct });
});

//delete product
export const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  await ProductService.deleteProduct(productId);
  res.status(200).json({ message: "Product successfully deleted" });
});

