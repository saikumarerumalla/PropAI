import algoliasearch from 'algoliasearch';

// This script now assumes that environment variables are loaded by the execution environment (e.g., Next.js or tsx --env-file)
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;

if (!appId || !adminKey) {
  throw new Error(
    'Algolia App ID or Admin API Key is not configured in the environment. Please ensure .env.local is being loaded.'
  );
}

// Initialize Algolia client with Admin key for backend operations
const client = algoliasearch(appId, adminKey);
const index = client.initIndex('properties');

export const search = async (query: string) => {
  return await index.search(query);
};

export const addObjects = async (objects: any[]) => {
  return await index.saveObjects(objects, {
    autoGenerateObjectIDIfNotExist: true,
  });
};
