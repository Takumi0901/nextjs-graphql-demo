import "isomorphic-fetch";
// import { createHttpLink } from 'apollo-link-http'
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";

// @ts-ignore
import apolloLogger from "apollo-link-logger";

const url = "http://localhost:3000";

const uploadLink = createUploadLink({
  uri: `${url}/api`
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
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
