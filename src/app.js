import express from "express";
import connectDB from "../src/config/db.js";

const app = express();

app.use(express.json());

const PORT = 3333;

// const startServer = async () => {
//   await connectDB();
//   app.listen(PORT, () => {
//     console.info(`server running on port ${PORT}`);
//   });
// };

// startServer();
app.listen(PORT, () => {
  console.info(`server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(201).send({ msg: "hello" });
});

// mockup data
const users = [
  {
    id: 1,
    name: "romi",
    age: "30",
  },
  {
    id: 2,
    name: "joen jong seon",
    age: "30",
  },
  {
    id: 3,
    name: "dewi",
    age: "30",
  },
];

// get request
app.get("/api/v1/users", (req, res) => {
  console.log(req.query);
  // res.send(users);
  const {
    query: { filter, value },
  } = req;
  if (filter && value) {
    return res.send(users.filter((user) => user[filter].includes(value)));
  }
  return res.send(users);
});

// post request
app.post("/api/v1/users", (req, res) => {
  const { body } = req;
  console.log(body);
  const createUser = { id: users[users.length - 1].id + 1, ...body };
  users.push(createUser);
  return res.status(201).send(createUser);
});

// const testUser = {
//   id: 4,
//   name: "test",
//   age: "30",
// };

// const result = { ...users[0] };
// console.log(result);

// get request with params
app.get("/api/v1/users/:id", (req, res) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) {
    res.status(400).send({ msg: "invalid id" });
  }
  // console.log(res.json({ id: parseId, name: "romi", age: "30" }));
  // console.log(req.statusCode)

  const findUser = users.find((user) => user.id === parseId);
  if (!findUser) {
    return res.status(404).send({ msg: "user not found" });
  }
  return res.send(findUser);
});

// patch \\ use to update partial field
app.patch("/api/v1/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.status(400).send({ msg: "invalid request" });
  const userIdx = users.findIndex((user) => user.id === parseId);
  if (userIdx === -1) return res.sendStatus(404);
  users[userIdx] = { ...users[userIdx], ...body };
  return res.sendStatus(200);
});

// put \\ use to update entire fields
app.put("/api/v1/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.status(400).send({ msg: "invalid request" });
  const userIdx = users.findIndex((user) => user.id === parseId);
  if (userIdx === -1) return res.sendStatus(404);
  users[userIdx] = { id: parseId, ...body };
  return res.sendStatus(200);
});
// delete
