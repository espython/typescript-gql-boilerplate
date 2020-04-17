import { QueryMap } from "../../types/graphql-util";

/**
 * graphql queries definitions
 */
const LoginQuery: QueryMap = {
  currentUser: (parent, args, context: any) => context.getUser(),
  welcome: (_, { name }): string => {
    return `Welcome ${name || "World"}`;
  }
};

export default LoginQuery;
