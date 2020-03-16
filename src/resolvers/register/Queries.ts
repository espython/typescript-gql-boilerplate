import { QueryMap } from "../../types/graphql-util";

/**
 * graphql queries definitions
 */
const Queries: QueryMap = {
  hello: (_, { name }): string => {
    return `Hello ${name || "World"}`;
  },
  welcome: (_, { name }): string => {
    return `Welcome ${name || "World"}`;
  }
};

export default Queries;
