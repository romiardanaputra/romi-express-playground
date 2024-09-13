import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createUserSchema, filterUserSchema } from "../validations/users.js";
import { users } from "../data/index.js";
import { resolveUserIdx } from "../middlewares/index.js";
import { User } from "../schemas/user.js";

const router = Router();

router.get("/api/v1/users", async (req, res) => {});

router.post(
  "/api/v1/users",
  checkSchema(createUserSchema),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const data = matchedData(req);
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
