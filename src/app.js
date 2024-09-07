import express from "express";
import connectDB from "../src/config/db.js";

const app = express();

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

app.get("/api/v1/users", (req, res) => {
  console.log(req.query);
  // res.send(users);
  const {
    query: { filter, value },
  } = req;
  if (filter && value) {
    return res.send(users.filter((user) => user[filter].includes(value)));
  }
  if (!filter && !value) {
    return res.send(users);
  }
  return res.status(400).send({ msg: "invalid query" });
});

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

app.use(express.json());
