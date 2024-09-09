import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createUserSchema, filterUserSchema } from "../validations/users.js";
import { users } from "../data/index.js";
import { resolveUserIdx } from "../middlewares/index.js";
const router = Router();

router.get("/api/v1/users", checkSchema(filterUserSchema), (req, res) => {
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

router.post("/api/v1/users", checkSchema(createUserSchema), (req, res) => {
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
router.get("/api/v1/users/:id", resolveUserIdx, (req, res) => {
  const { userIdx } = req;
  const findUser = users[userIdx];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

// patch \\ use to update partial field
router.patch("/api/v1/users/:id", resolveUserIdx, (req, res) => {
  const { body, userIdx } = req;
  users[userIdx] = { ...users[userIdx], ...body };
  return res.sendStatus(200);
});

// put \\ use to update entire fields
router.put("/api/v1/users/:id", resolveUserIdx, (req, res) => {
  const { body, userIdx } = req;
  users[userIdx] = { id: users[userIdx].id, ...body };
  return res.sendStatus(200);
});

// delete
router.delete("/api/v1/users/:id", resolveUserIdx, (req, res) => {
  const { userIdx } = req;
  users.splice(userIdx);
  return res.sendStatus(200);
});

export default router;
