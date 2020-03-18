import { QueryMap } from "../../types/graphql-util";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";

/**
 * graphql queries definitions
 */
const LoginQueries: QueryMap = {
  login: async (args): Promise<string> => {
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
        return `login success`;
      }
    }

    return `user ${args.email} not found`;
  }
};

export default LoginQueries;
