// /tests/graphql/utils.ts
import { graphql } from 'graphql';
import schema from '../../src/graphql/schema.js';

/**
 * Execute a GraphQL query/mutation with optional authentication
 * @param query - The GraphQL query or mutation string
 * @param variables - Variables for the query
 * @param authenticated - Whether to include authenticated user in context
 */
export async function runQuery(
  query: string,
  variables?: any,
  authenticated: boolean = false
) {
  const context = authenticated
    ? {
        user: {
          googleId: '104033539283338196039',  // Real user googleId
          email: '10toasterg@gmail.com',       // Real user email
        },
      }
    : {};

  return graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: context,
  });
}

/**
 * Execute query with authentication (shorthand)
 */
export async function runAuthQuery(query: string, variables?: any) {
  return runQuery(query, variables, true);
}