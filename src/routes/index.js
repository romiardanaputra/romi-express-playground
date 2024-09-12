import { Router } from "express";
import usersRouter from "../routes/users.js";
import productsRouter from "../routes/products.js";
import authRouter from "../routes/auth.js";
import cartsRouter from "../routes/carts.js";

const router = Router();

router.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  console.log((req.session.visited = true));
  req.session.visited = true;
  res.cookie("setCookie", "cookieValue", { maxAge: 30000, signed: true });
  res.status(201).send({ msg: "hello" });
});

router.use(usersRouter);
router.use(productsRouter);
// router.use(authRouter);
router.use(cartsRouter);

export default router;
