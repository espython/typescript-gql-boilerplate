import { QueryMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import { Context } from "graphql-yoga/dist/types";

const userQuery: QueryMap = {
  user: async (parent, args, ctx: Context, info): Promise<User | null> => {
    // check if there is a current user ID
    console.log("args", args);
    if (ctx.request.userId) {
      const userwithId = await User.findOne({
        where: { id: ctx.request.userId }
      });

      console.log("userWithId", userwithId);
      return userwithId!;
    } else {
      return null;
    }
  }
};

export default userQuery;
