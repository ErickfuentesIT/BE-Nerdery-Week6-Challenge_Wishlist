import express, { Application, Request } from "express";
import cors from "cors";
import { ApolloServer, BaseContext } from "@apollo/server";
import { typeDefs, resolvers } from "./resolvers/products.resolver";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  const app: Application = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
function expressMiddleware(
  server: ApolloServer<BaseContext>,
): import("express-serve-static-core").RequestHandler<
  {},
  any,
  any,
  import("qs").ParsedQs,
  Record<string, any>
> {
  throw new Error("Function not implemented.");
}
