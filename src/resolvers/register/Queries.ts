import { QueryMap } from "../../types/graphql-util";

/**
 * graphql queries definitions
 */
const RegisterQueries: QueryMap = {
  hello: (_, { name }): string => {
    return `Hello ${name || "World"}`;
  },
  welcome: (_, { name }): string => {
    return `Welcome ${name || "World"}`;
  }
};

export default RegisterQueries;
