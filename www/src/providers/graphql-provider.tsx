"use client";

import { FC } from "react";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";

const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL;

export type GraphQLProviderProps = {
  children?: React.ReactNode;
};

const GraphQLProvider: FC<GraphQLProviderProps> = (props) => {
  const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache(),
  });
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default GraphQLProvider;