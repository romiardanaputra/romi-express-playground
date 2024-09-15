import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/api/v1/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

router.get("/api/v1/auth/status", (req, res) => {
  console.log(`Inside auth/status endpoint`);
  console.log(req.user);
  console.log(req.session);
  console.log(req.sessionID);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

router.post("/api/v1/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.send(200);
  });
  console.log(`what is inside req.user? ${req.user}`);
});
export default router;
