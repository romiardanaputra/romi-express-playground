import express from "express";
import usersRouter from "./routes/users.js";
import routes from "./routes/index.js";

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

app.get("/", (req, res) => {
  res.status(201).send({ msg: "hello" });
});

app.use(routes);
