import express from "express";
import {
  body,
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { users } from "./data/index.js";
import { createUserSchema } from "./validations/users.js";

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

const resolveUserIdx = (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.status(400).send({ msg: "invalid request" });
  const userIdx = users.findIndex((user) => user.id === parseId);
  if (userIdx === -1) return res.sendStatus(404);
  req.userIdx = userIdx;
  console.log("result inside resolveUserIdx", userIdx);
  next();
};

app.use(loggingMiddleware);

app.get("/", (req, res) => {
  res.status(201).send({ msg: "hello" });
});

// get request
app.get("/api/v1/users", checkSchema(filterUserSchema), (req, res) => {
  // console.log(req["express-validator#contexts"]);
  const result = validationResult(req);
  console.log(result);
  const {
    query: { filter, value },
  } = req;
  if (filter && value) {
    return res.send(users.filter((user) => user[filter].includes(value)));
  }
  return res.send(users);
});

// post request
app.post("/api/v1/users", checkSchema(createUserSchema), (req, res) => {
  const result = validationResult(req);
  console.log(result);
  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });
  const data = matchedData(req);
  const createUser = { id: users[users.length - 1].id + 1, ...data };
  users.push(createUser);
  return res.status(201).send(createUser);
});

// get request with params
app.get("/api/v1/users/:id", resolveUserIdx, (req, res) => {
  const { userIdx } = req;
  const findUser = users[userIdx];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

// patch \\ use to update partial field
app.patch("/api/v1/users/:id", resolveUserIdx, (req, res) => {
  const { body, userIdx } = req;
  users[userIdx] = { ...users[userIdx], ...body };
  return res.sendStatus(200);
});

// put \\ use to update entire fields
app.put("/api/v1/users/:id", resolveUserIdx, (req, res) => {
  const { body, userIdx } = req;
  users[userIdx] = { id: users[userIdx].id, ...body };
  return res.sendStatus(200);
});

// delete
app.delete("/api/v1/users/:id", resolveUserIdx, (req, res) => {
  const { userIdx } = req;
  users.splice(userIdx);
  return res.sendStatus(200);
});

// experimental area

// const testUser = {
//   id: 4,
//   name: "test",
//   age: "30",
// };

// const result = { ...users[0] };
// console.log(result);

// console.log(res.json({ id: parseId, name: "romi", age: "30" }));
// console.log(req.statusCode)
