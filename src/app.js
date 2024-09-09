import express from "express";
import usersRouter from "./routes/users.js";

const app = express();

app.use(express.json());

const PORT = 3333;

app.listen(PORT, () => {
  console.info(`server running on port ${PORT}`);
});

/**
 * A middleware function that logs information about incoming HTTP requests.
 *
 * @param {object} req - The incoming HTTP request object.
 * @param {object} res - The outgoing HTTP response object.
 * @param {function} next - A function to call to continue processing the request.
 * @return {undefined}
 */
const loggingMiddleware = (req, res, next) => {
  console.log("log");
  console.log(`${req.method} - ${req.url}`);
  next();
};

app.use(loggingMiddleware);

app.get("/", (req, res) => {
  res.status(201).send({ msg: "hello" });
});

// users domain routes
app.use(usersRouter);
