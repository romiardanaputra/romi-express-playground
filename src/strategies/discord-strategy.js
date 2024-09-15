import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../schemas/discord-user.js";

export default passport.use(
  new Strategy(
    {
      clientID: "1284366855284457522",
      clientSecret: "Nq1jfOb1qkGwnHJr1BY09TwVKEH5Ks9X",
      callbackURL: "http://localhost:3333/api/auth/discord/redirect",
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const findUser = await DiscordUser.findOne({
        discordId: profile.id,
      });
      if (!findUser) {
        const newUser = new DiscordUser({
          discordId: profile.id,
          username: profile.username,
        });
        const newSavedUser = await newUser.save();
        return cb(null, newSavedUser);
      }
    }
  )
);
