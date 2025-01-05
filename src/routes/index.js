import { Router } from "express";
import userRouter from "./user.route.js";
import categoryRouter from "./category.route.js";
const router = Router();

router.use("/api", userRouter);
router.use("/api", categoryRouter);
router.use("*", (req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

export default router;
