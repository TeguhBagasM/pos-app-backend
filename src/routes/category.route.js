import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";
import { autenticate } from "../controllers/errorController.js";
const categoryRoute = Router();

categoryRoute.get("/categories", autenticate, getAllCategory);
categoryRoute.get("/categories/:id", autenticate, getCategoryById);
categoryRoute.post("/categories", autenticate, createCategory);
categoryRoute.put("/categories/:id", autenticate, updateCategory);
categoryRoute.delete("/categories/:id", autenticate, deleteCategory);

export default categoryRoute;
