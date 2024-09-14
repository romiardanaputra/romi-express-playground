import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../schemas/user.js";
import { comparePassword } from "../utils/helpers.js";

passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Inside deserialize User`);
  console.log(`Deserializing user id ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    console.log(`username :${username}`);
    console.log(`password :${password}`);
    try {
      const findUser = await User.findOne({
        username,
      });
      if (!findUser) throw new Error("user not found");
      if (!comparePassword(password, findUser.password))
        throw new Error("bad credentials");
      done(null, findUser);
    } catch (err) {
      console.log(err);
      done(err, null);
    }
  })
);
