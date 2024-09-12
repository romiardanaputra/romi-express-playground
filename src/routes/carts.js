import { Router } from "express";

const router = Router();

router.post("/api/v1/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { body: item } = req;
  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    return (req.session.cart = [item]);
  }
  return res.status(201).send({ msg: "success", cart });
});

export default router;
