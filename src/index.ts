import "reflect-metadata";
import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import Redis from "ioredis";

import { addTokenToReqObj } from "./middlewares";
import RegisterQueries from "./resolvers/register/Queries";
import RegisterMutations from "./resolvers/register/Mutations";
import LogoutMutations from "./resolvers/logout/Mutation";
import { User } from "./entity/User";
import LoginQueries from "./resolvers/login/Queries";

const typeDefs = `./src/schema.graphql`;

const resolvers = {
  Query: { ...RegisterQueries, ...LoginQueries },
  Mutation: { ...RegisterMutations, ...LogoutMutations }
};

const connectDb = async (retries = 5) => {
  while (retries) {
    try {
      await createConnection();
      console.log(`connection has been created Successfully`);
      console.log(`test git-hub deployment`);
      break;
    } catch (err) {
      console.log(err);
      retries -= 1;
      console.log(`retries left: ${retries}`);
      // wait 5 seconds
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

const redis = new Redis();
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ request, response }): object => ({
    redis,
    url: request.protocol + "://" + request.get("host"),
    response,
    request
  })
});
// using coockie parser as a middleware
server.express.use(cookieParser());
// Add  token to the request Object
server.express.use(addTokenToReqObj);
server.express.get("/confirm/:id", async (req, res) => {
  const { id } = req.params;
  const userId = await redis.get(id);
  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    res.send("ok");
  } else {
    res.send("invalid");
  }
});
connectDb()
  .then(() => {
    server.start({ port: 4000, endpoint: "/graphql" }, () => {
      console.log("Server is running on localhost:4000");
    });
  })
  .catch(error => console.log(error));
