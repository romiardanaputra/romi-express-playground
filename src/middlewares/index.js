export const resolveUserIdx = (req, res, next) => {
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

export const loggingMiddleware = (req, res, next) => {
  console.log("log");
  console.log(`${req.method} - ${req.url}`);
  next();
};
