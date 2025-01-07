import { Router } from "express";
// import { autenticate } from "../controllers/errorController.js";
import {
  createProduct,
  deleteProduct,
  generateExcel,
  generatePdf,
  getAllProduct,
  getProductByCategory,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
const productRoute = Router();

productRoute.post("/products", createProduct);
productRoute.get("/products", getAllProduct);
productRoute.get("/products/:id", getProductById);
productRoute.get("/products/category/:id", getProductByCategory);
productRoute.put("/products/:id", updateProduct);
productRoute.delete("/products/:id", deleteProduct);
productRoute.get("/products-pdf", generatePdf);
productRoute.get("/products-excel", generateExcel);

export default productRoute;
