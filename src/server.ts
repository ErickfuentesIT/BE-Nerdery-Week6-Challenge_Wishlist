import express, { Application } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs, resolvers } from "./resolvers/wishlist.resolver";
import dotenv from "dotenv";
import exportsRoutes from "./routes/exports.route";
import depthLimit from "graphql-depth-limit";

dotenv.config();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  const app: Application = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [depthLimit(5)],
  });

  // EXPORT CSV ROUTE
  app.use("/exports", exportsRoutes);
  // GRAPHQL SINGLE EP
  await server.start();
  app.use("/graphql", express.json(), expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
