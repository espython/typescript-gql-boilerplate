import "reflect-metadata";
import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import cookieParser from "cookie-parser";
import cors from "cors";
import Redis from "ioredis";
import passport from "passport";

import { faceBookStrategy, addTokenToReqObj } from "./middlewares";
import RegisterQueries from "./resolvers/register/Queries";
import RegisterMutations from "./resolvers/register/Mutations";
import LogoutMutations from "./resolvers/logout/Mutation";
import { User } from "./entity/User";
import LoginMutaions from "./resolvers/login/LoginMutaion";
import userQuery from "./resolvers/user/Query";
import { createTypeormConn } from "./utils/createTypeOrmConn";

createTypeormConn();

const typeDefs = `./src/schema.graphql`;

const resolvers = {
  Query: { ...RegisterQueries, ...userQuery },
  Mutation: { ...RegisterMutations, ...LogoutMutations, ...LoginMutaions }
};

// const connectDb = async (retries = 5) => {
//   while (retries) {
//     try {
//       await createConnection();
//       console.log(`connection has been created Successfully`);
//       console.log(`test git-hub deployment`);
//       break;
//     } catch (err) {
//       console.log(err);
//       retries -= 1;
//       console.log(`retries left: ${retries}`);
//       // wait 5 seconds
//       await new Promise(res => setTimeout(res, 5000));
//     }
//   }
// };

const redis = new Redis();
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ request, response }): any => ({
    redis,
    url: request.protocol + "://" + request.get("host"),
    response,
    request,
    getUser: () => request.user
  })
});
// using coockie parser as a middleware
server.express.use(cookieParser());
// Add  token to the request Object
server.express.use(addTokenToReqObj);
// enable passport facebook strategy
passport.use(faceBookStrategy);
server.express.use(passport.initialize());

server.express.get("/auth/facebook", cors(), passport.authenticate("facebook"));

server.express.get(
  "/auth/facebook/callback",
  cors(),
  passport.authenticate("facebook", { failureRedirect: "/", session: false }),
  (req, res) => {
    // (req.session as any).userId = (req.user as any).id;
    // @todo redirect to frontend
    // res.status(201).redirect("http://localhost:7777/home");
    res.status(201).json({ "facebook-login": "sucess" });
  }
);
// Enable Cors
// server.express.use(cors());
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

server.start(
  {
    port: 4000,
    endpoint: "/graphql",
    cors: {
      credentials: true,
      origin: ["http://localhost:7777"] // your frontend url.
    }
  },
  () => {
    console.log("Server is running on localhost:4000");
  }
);
