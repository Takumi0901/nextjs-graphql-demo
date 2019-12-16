import fetch from "node-fetch";
import { ApolloServer, gql } from "apollo-server-micro";
import { importSchema } from "graphql-import";
import { Resolvers } from "../../gen/types";

const typeDefs = importSchema("./graphql/schema.graphql");

// ここからGraphQLのモックの定義
async function fetchUsers() {
  const res = await fetch(`https://qiita.com/api/v2/items?page=1&per_page=100`);
  return res.json();
}

const resolvers: Resolvers = {
  Query: {
    async users() {
      const res = await fetchUsers();
      return res.map(e => {
        return {
          id: e.id,
          name: e.user.name
        };
      });
    }
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
