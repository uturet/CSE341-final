import { graphql } from 'graphql';
import schema from '../../src/graphql/schema.js';

export async function runQuery(query: string, variables?: any) {
  return graphql({
    schema,
    source: query,
    variableValues: variables,
  });
}
