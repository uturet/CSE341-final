import { graphql } from 'graphql';
import schema from '../../src/graphql/schema';

export function executeGraphQL(query: string, variables?: any) {
  return graphql({
    schema,
    source: query,
    variableValues: variables,
  });
}
