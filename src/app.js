import express from "express";
import routes from "./routes/index.js";
import cookieParser, { signedCookie, signedCookies } from "cookie-parser";

const app = express();

app.use(express.json());

const PORT = 3333;

app.listen(PORT, () => {
  console.info(`server running on port ${PORT}`);
});

const loggingMiddleware = (req, res, next) => {
  console.log("log");
  console.log(`${req.method} - ${req.url}`);
  next();
};

app.use(loggingMiddleware);

app.use(cookieParser("secretCookie"));
app.get("/", (req, res) => {
  res.cookie("setCookie", "cookieValue", { maxAge: 30000, signed: true });
  res.status(201).send({ msg: "hello" });
});

app.use(routes);
