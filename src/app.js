import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { loggingMiddleware } from "./middlewares/index.js";

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

app.use(routes);

const PORT = 3333;
app.listen(PORT, () => {
  console.info(`server running on port ${PORT}`);
});
