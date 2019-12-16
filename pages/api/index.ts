import { ApolloServer, gql } from "apollo-server-micro";
import { importSchema } from "graphql-import";
import { Resolvers } from "../../gen/types";

const typeDefs = importSchema("./graphql/schema.graphql");

// ここからGraphQLのモックの定義
const resolvers: Resolvers = {
  Query: {
    users: () => [
      {
        id: 1,
        name: "hogege"
      }
    ]
  }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

// ここから先はNext.jsが読みに行く領域
export default apolloServer.createHandler({ path: "/api" });
export const config = {
  api: {
    bodyParser: false
  }
};
