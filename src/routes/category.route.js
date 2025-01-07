import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";
// import { autenticate } from "../controllers/errorController.js";
const categoryRoute = Router();

categoryRoute.get("/categories", getAllCategory);
categoryRoute.get("/categories/:id", getCategoryById);
categoryRoute.post("/categories", createCategory);
categoryRoute.put("/categories/:id", updateCategory);
categoryRoute.delete("/categories/:id", deleteCategory);

export default categoryRoute;
