import "reflect-metadata";
import redis from "redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import { COOKIE_NAME, __prod__ } from "./constants";
import connectRedis from "connect-redis";
import { buildSchema } from "type-graphql";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { HelloResolver } from "./resolvers/hello";
import { ApolloServer } from "apollo-server-express";
// import { sendEmail } from "./utils/sendEmail";
// import { User } from "./entities/User";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  // await orm.em.nativeDelete(User, {});
  await orm.getMigrator().up();

  const app = express();
  const port = 4000;

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax", //csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "jnfsnfaodjfnaofn",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
});
