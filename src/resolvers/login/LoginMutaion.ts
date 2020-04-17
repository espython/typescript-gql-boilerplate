import { MutationMap } from "../../types/graphql-util";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { Context } from "graphql-yoga/dist/types";
import jwt from "jsonwebtoken";

/**
 * graphql queries definitions
 */
const LoginMutations: MutationMap = {
  login: async (parent, args, ctx: Context, info): Promise<User | null> => {
    // console.log("args", args);
    // if (ctx.request.userId) {
    //   const userwithId = await User.findOne({
    //     where: { id: ctx.request.userId }
    //   });

    //   console.log("userWithId", userwithId);
    //   return userwithId!.email;
    // }

    const user = await User.findOne({
      where: { email: args.email }
    });

    if (user) {
      const correctPassword = await bcrypt.compare(
        args.password,
        user.password as string
      );
      console.log("passwordIsCorrect", correctPassword);
      if (!correctPassword) {
        throw new Error("Invalid Password!");
      }
      if (user && correctPassword === true) {
        console.log("secret ==>", process.env.APP_SECRET);
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET!);
        ctx.response.cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365
        });
        // ctx.response.staus(201).json({ token: token });
        console.log("token", user);
        return user;
      }
    }

    throw new Error(`No such user found for email ${args.email}`);
  }
};

export default LoginMutations;
