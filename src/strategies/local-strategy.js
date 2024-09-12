import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../data/index.js";

passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(`Inside deserialize User`);
  console.log(`Deserializing user id ${id}`);
  try {
    const findUser = users.find((user) => user.id === id);
    if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`username :${username}`);
    console.log(`password :${password}`);
    try {
      const findUser = users.find((user) => user.username === username);
      if (!findUser) throw new Error("user not found");
      if (findUser.password !== password) {
        throw new Error("invalid credentials");
      }
      done(null, findUser);
    } catch (err) {
      console.log(err);
      done(err, null);
    }
  })
);
