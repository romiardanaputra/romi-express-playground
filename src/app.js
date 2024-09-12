import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { loggingMiddleware } from "./middlewares/index.js";
import { users } from "./data/index.js";

const app = express();

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

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  console.log((req.session.visited = true));
  req.session.visited = true;
  res.cookie("setCookie", "cookieValue", { maxAge: 30000, signed: true });
  res.status(201).send({ msg: "hello" });
});

app.post("/api/v1/auth", (req, res) => {
  const {
    body: { name, password },
  } = req;
  const findUser = users.find((user) => user.name === name);

  if (!findUser || findUser.password !== password)
    return res.status(401).send({ msg: "bad credentials" });

  req.session.user = findUser;
  return res.status(200).send({ msg: "success", findUser });
});

app.get("/api/v1/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, sessionData) => {
    console.log(sessionData);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "unauthorized" });
});

app.post("/api/v1/cart", (req, res) => {
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

app.use(routes);

const PORT = 3333;
app.listen(PORT, () => {
  console.info(`server running on port ${PORT}`);
});
