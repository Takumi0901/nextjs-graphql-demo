import "isomorphic-fetch";
// import { createHttpLink } from 'apollo-link-http'
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
// @ts-ignore
import { createNetworkStatusNotifier } from "react-apollo-network-status";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";

// @ts-ignore
import apolloLogger from "apollo-link-logger";

const url = "http://localhost:3000";

// const {
//   NetworkStatusNotifier,
//   link: networkStatusNotifierLink
// } = createNetworkStatusNotifier();
// export const NetworkStatusNotifierElement = NetworkStatusNotifier;

const uploadLink = createUploadLink({
  uri: `${url}/api`
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdGFmZi5hcGkiLCJleHAiOjE1NzkxNDk1NjcsInN1YiI6IntcImlkXCI6NTAwNixcIm1hbmFnZW1lbnRPZmZpY2VJZFwiOjF9In0.GWmwzlkj9XhemQzvzON2JTcQP43sBBXe61OezL7UMqY`
    }
  };
});

let apolloLinks = [];

if (process.env.NODE_ENV !== "production") {
  apolloLinks = [apolloLogger, authLink, uploadLink];
} else {
  apolloLinks = [authLink, uploadLink];
}

export const client = new ApolloClient({
  link: ApolloLink.from(apolloLinks),
  cache: new InMemoryCache()
});
