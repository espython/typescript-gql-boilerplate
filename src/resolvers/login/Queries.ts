import { QueryMap } from "../../types/graphql-util";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { Context } from "graphql-yoga/dist/types";
import jwt from "jsonwebtoken";

/**
 * graphql queries definitions
 */
const LoginQueries: QueryMap = {
  login: async (parent, args, ctx: Context, info): Promise<string | null> => {
    console.log("args", args);
    if (ctx.request.userId) {
      const userwithId = await User.findOne({
        where: { id: ctx.request.userId }
      });

      console.log("userWithId", userwithId);
      return userwithId!.email;
    }

    const user = await User.findOne({
      where: { email: args.email }
    });

    if (user) {
      const correctPassword = await bcrypt.compare(
        args.password,
        user.password
      );
      console.log("passwordIsCorrect", correctPassword);
      if (!correctPassword) {
        return `wrong password ${args.password} `;
      }
      if (user && correctPassword === true) {
        console.log("secret ==>", process.env.APP_SECRET);
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET!);
        ctx.response.cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365
        });
        console.log("token", token);
        return `login success`;
      }
    }

    return `user ${args.email} not found`;
  }
};

export default LoginQueries;
