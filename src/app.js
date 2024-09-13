import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { loggingMiddleware } from "./middlewares/index.js";
import passport from "passport";
import "./strategies/local-strategy.js";
import mongoose from "mongoose";

const app = express();

mongoose
  .connect("mongodb://localhost:27017/express-playground")
  .then(() => console.log(`connected to database`))
  .catch((err) => console.log(err));

app.use(express.json());

app.use(loggingMiddleware);

app.use(cookieParser("secretCookie"));

app.use(
  session({
    secret: "SignSessionCookie",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 60 }, // add secure: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.post("/api/v1/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

app.get("/api/v1/auth/status", (req, res) => {
  console.log(`Inside auth/status endpoint`);
  console.log(req.user);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post("/api/v1/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.send(200);
  });
  console.log(`what is inside req.user? ${req.user}`);
});

const PORT = 3333;
app.listen(PORT, () => {
  console.info(`server running on port ${PORT}`);
});
