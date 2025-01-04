import { Router } from "express";

import { autenticate } from "../controllers/errorController.js";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  loginUser,
  setRefreshToken,
  updateUser,
} from "../controllers/userController.js";
const userRouter = Router();

userRouter.post("/users", createUser);
userRouter.put("/users/:id", autenticate, updateUser);
userRouter.post("/users/login", loginUser);
userRouter.delete("/users/:id", autenticate, deleteUser);
userRouter.get("/users", autenticate, getAllUser);
userRouter.get("/users/refresh", setRefreshToken);
userRouter.get("/users/:id", autenticate, getUserById);

export default userRouter;
