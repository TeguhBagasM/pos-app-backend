import { Router } from "express";
import userRouter from "./user.route.js";
import categoryRouter from "./category.route.js";
import productRouter from "./product.route.js";
const router = Router();

router.use("/api", userRouter);
router.use("/api", categoryRouter);
router.use("/api", productRouter);
router.use("*", (req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

export default router;
