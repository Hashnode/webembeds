/* eslint-disable import/prefer-default-export */

const { HASHNODE_GRAPHQL_URL, HASHNODE_GRAPHQL_USER_ACCESS_TOKEN } = process.env;

if (!HASHNODE_GRAPHQL_URL) {
  throw new Error("HASHNODE_GRAPHQL_URL is not defined");
}

if (!HASHNODE_GRAPHQL_USER_ACCESS_TOKEN) {
  throw new Error("HASHNODE_GRAPHQL_USER_ACCESS_TOKEN is not defined");
}

// client tracking (https://dev.stellate.co/docs/graphql-metrics/clients)
const STELLATE_CLIENT_NAME_HEADER = "x-graphql-client-name";
const STELLATE_CLIENT_VERSION_HEADER = "x-graphql-client-version";

const isServer = typeof window === "undefined";

/**
 * Executes a GraphQL query and returns the data and errors.
 */
export const fetchGraphQL = async (options: {
  query: string;
  variables?: Record<string, unknown>
}) => {
  const { query, variables = {} } = options || {};

  try {
    const response = await fetch(HASHNODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "hn-trace-app": "Embeds",
        [STELLATE_CLIENT_NAME_HEADER]: "webembeds",
        [STELLATE_CLIENT_VERSION_HEADER]: isServer ? "server" : "browser",
        Authorization: HASHNODE_GRAPHQL_USER_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        ...(variables ? { variables } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching GraphQL. Status code: ${response.status}.`);
    }

    const json = await response.json();
    const { data, errors } = json;
    return { data, errors };
  } catch (error) {
    console.error("Error fetching GraphQL", { error });
    throw error;
  }
};
