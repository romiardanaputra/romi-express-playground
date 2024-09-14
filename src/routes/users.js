import { Router } from "express";
import {
  checkSchema,
  matchedData,
  validationResult,
  query,
} from "express-validator";
import { createUserSchema } from "../validations/users.js";
import { users } from "../data/index.js";
import { resolveUserIdx } from "../middlewares/index.js";
import { User } from "../schemas/user.js";
import { hashPassword } from "../utils/helpers.js";

const router = Router();

router.get(
  "/api/v1/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("filter is required")
    .isLength({
      min: 3,
      max: 10,
    })
    .withMessage("must be at least 3-10 characters"),
  async (req, res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.sessionID, (err, sessionData) => {
      if (err) throw err;
      console.log("inside session store get");
      console.log(sessionData);
    });
    const result = validationResult(req);
    const {
      query: { filter, value },
    } = req;
    if (filter && value) {
      return res.send(users.filter((user) => user[filter].includes(value)));
    }
    return res.send(users);
  }
);

router.post(
  "/api/v1/users",
  checkSchema(createUserSchema),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const data = matchedData(req);
    console.log(data);
    data.password = hashPassword(data.password);
    console.log(data);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return res.status(201).send(savedUser);
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  }
);

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
