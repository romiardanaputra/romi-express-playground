import express from "express";

const app = express();

app.listen(3001, () => {
  console.info("server running on port 3001");
});
