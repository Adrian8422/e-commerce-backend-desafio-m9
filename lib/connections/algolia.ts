import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_ID_APP,
  process.env.API_KEY_ALGOLIA
);

export const productIndex = client.initIndex("products");
