import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { loggingMiddleware } from "./middlewares/index.js";
import passport from "passport";
// import "./strategies/local-strategy.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import "./strategies/discord-strategy.js";

const app = express();

mongoose
  .connect("mongodb://localhost:27017/express-playground")
  .then(() => console.log(`connected to database`))
  .catch((err) => console.log(err));

app.use(express.json());

app.use(loggingMiddleware);

app.use(cookieParser("secretCookie"));

app.use(
  session({
    secret: "SignSessionCookie",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 60 }, // add secure: true
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    res.sendStatus(200);
  }
);

const PORT = 3333;
app.listen(PORT, () => {
  console.info(`server running on port ${PORT}`);
});

// const clientId = 1284366855284457522
// const clientSecret = Nq1jfOb1qkGwnHJr1BY09TwVKEH5Ks9X
// const redirectUri = "http://localhost:3000/api/auth/discord/redirect"
