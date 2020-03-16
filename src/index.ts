import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import Redis from "ioredis";
// import { makeExecutableSchema } from "graphql-tools";
// import { merge } from "lodash";

// import utils from "./utils/utils";
import RegisterQueries from "./resolvers/register/Queries";
import RegisterMutations from "./resolvers/register/Mutations";
import { User } from "./entity/User";

// ... or using `require()`
// const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `./src/schema.graphql`;

const resolvers = {
  Query: RegisterQueries,
  Mutation: RegisterMutations
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

// merge our graphql schemas and resolvers
// const schema = makeExecutableSchema({
//   typeDefs: typeDefs,
//   resolvers: resolvers
// });
const redis = new Redis();
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ request }): object => ({
    redis,
    url: request.protocol + "://" + request.get("host")
  })
});
// using coockie parser as a middleware
server.express.use(cookieParser());
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

  APP_SECRET=JFDJFHJJFKJFJBSGWTEUNC.318,NCN*76W
SPARKPOST_API_KEY=908d10376a158a73dd7abbd6bd0833c8caadcb52
