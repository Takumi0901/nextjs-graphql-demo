import fetch from "node-fetch";
import { ApolloServer, gql } from "apollo-server-micro";
import { importSchema } from "graphql-import";
import { Resolvers } from "../../gen/types";
import { authorized } from "../../graphql/context";
import jwt from "jsonwebtoken";

const typeDefs = importSchema("./graphql/schema.graphql");

// ここからGraphQLのモックの定義
async function fetchUsers() {
  const res = await fetch(`https://qiita.com/api/v2/items?page=1&per_page=100`);
  return res.json();
}

const resolvers: Resolvers = {
  Query: {
    users(_obj, args, context) {
      return authorized(context)(async auth => {
        console.log("*****************");
        console.log(auth);
        console.log("*****************");
        const res = await fetchUsers();
        return res.map(e => {
          return {
            id: e.id,
            name: e.user.name
          };
        });
      });
    }
  }
};

const authHeaderRegex = /^Bearer (.+)/;

export function decode(token: string) {
  const decoded = jwt.decode(token);
  if (!decoded) {
    return null;
  }
  const data = JSON.parse(decoded.sub);
  const auth = {
    id: data["id"],
    token: token
  };
  return auth;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authHeader: string = req.headers.authorization || "";
    if (!authHeaderRegex.test(authHeader)) {
      return null;
    }
    const token = authHeader.replace(authHeaderRegex, "$1");
    return { auth: decode(token) };
  }
});

// ここから先はNext.jsが読みに行く領域
export default apolloServer.createHandler({ path: "/api" });
export const config = {
  api: {
    bodyParser: false
  }
};
