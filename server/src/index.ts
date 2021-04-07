import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { HelloResolver } from "./resolvers/hello";
import { ApolloServer } from "apollo-server-express";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();
  const port = 4000;

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
});
