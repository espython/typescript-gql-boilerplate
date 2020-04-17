import { Strategy } from "passport-facebook";

import "dotenv/config";
import { User } from "../entity/User";

import { getManager } from "typeorm";
console.log("facebook id", process.env.FACEBOOK_ID as string);
// const connection = async (): Promise<Connection> => {
//   const connection = await createTypeormConn();
//   return connection;
// };

export const faceBookStrategy = new Strategy(
  {
    clientID: process.env.FACEBOOK_ID as string,
    clientSecret: process.env.FACEBOOK_SECRET as string,
    callbackURL: "http://localhost:4000/auth/facebook/callback",
    profileFields: ["id", "email", "first_name", "last_name"]
  },
  async (_, __, profile, cb) => {
    console.log("facebook profile", profile);
    const { id, displayName, emails } = profile;

    const query = getManager()
      .createQueryBuilder(User, "user")
      .where("user.facebookId = :id", { id });

    let email: string | null = null;

    if (emails) {
      email = emails[0].value;
      query.orWhere("user.email = :email", { email });
    }

    let user = await query.getOne();

    // this user needs to be registered
    if (!user) {
      user = await User.create({
        facebookId: id,
        name: displayName,
        email
      }).save();
    } else if (!user.facebookId) {
      // merge account
      // we found user by email
      user.facebookId = id;
      await user.save();
    } else {
      // we have a twitterId
      // login
    }

    return cb(null, { id: user.id });
  }
);
