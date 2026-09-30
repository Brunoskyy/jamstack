import { createClient, type Client } from '@prismicio/client'

/** The Prismic client, or null when no repository is configured. */
export function getPrismicClient(): Client | null {
  const endpoint = process.env.PRISMIC_API_ENDPOINT
  if (!endpoint) return null
  const token = process.env.PRISMIC_ACCESS_TOKEN
  return createClient(endpoint, token ? { accessToken: token } : {})
}
