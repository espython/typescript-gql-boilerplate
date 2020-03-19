import { MutationMap } from "../../types/graphql-util";

const Mutations: MutationMap = {
  logout: (parent, args: GQL.IMutation, ctx, info) => {
    ctx.response.clearCookie("token");
    return { message: "Goodbye" };
  }
};

export default Mutations;
