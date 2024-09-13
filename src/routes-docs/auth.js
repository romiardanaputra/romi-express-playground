import { Router } from "express";
import { users } from "../data/index.js";

const router = Router();

router.post("/api/v1/auth", (req, res) => {
  const {
    body: { name, password },
  } = req;
  const findUser = users.find((user) => user.name === name);

  if (!findUser || findUser.password !== password)
    return res.status(401).send({ msg: "bad credentials" });

  req.session.user = findUser;
  return res.status(200).send({ msg: "success", findUser });
});

router.get("/api/v1/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, sessionData) => {
    console.log(sessionData);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "unauthorized" });
});

export default router;
