import { Router } from "express";

const router = Router();

export const product = [
  {
    id: 1,
    name: "product 1",
    price: "100",
  },
  {
    id: 2,
    name: "product 2",
    price: "200",
  },
  {
    id: 3,
    name: "product 3",
    price: "300",
  },
];

router.get("/api/v1/products", (req, res) => {
  console.log(req.cookies);
  console.log(req.signedCookies.setCookie);
  if (
    req.signedCookies.setCookie &&
    req.signedCookies.setCookie === "cookieValue"
  ) {
    return res.send(product).status(200);
  }
  return res.send({ msg: "unauthorized" }).status(201);
});

export default router;
