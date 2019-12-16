import React from "react";
import App from "next/app";
import { client } from "../graphql/client";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ApolloHooksProvider client={client}>
        <Component {...pageProps} />
      </ApolloHooksProvider>
    );
  }
}
