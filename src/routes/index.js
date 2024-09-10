import { Router } from "express";
import usersRouter from "../routes/users.js";
import productsRouter from "../routes/products.js";

const router = Router();

router.use(usersRouter);
router.use(productsRouter);

export default router;
