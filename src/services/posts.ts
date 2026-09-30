import type { RichTextField } from '@prismicio/client'

import fixtures from '../../fixtures/posts.json'
import type { Post, PostPage, PostSummary } from '../lib/types'
import { getPrismicClient } from './prismic'

export const PAGE_SIZE = 5

/**
 * Posts come from Prismic when `PRISMIC_API_ENDPOINT` is set, and from
 * `fixtures/posts.json` otherwise, so the site runs and builds without an
 * account. Both paths return the same shapes.
 */
export async function listPosts(page = 1): Promise<PostPage> {
  const prismic = getPrismicClient()
  if (!prismic) return listFixtures(page)
  const response = await prismic.getByType('posts', {
    page,
    pageSize: PAGE_SIZE,
    orderings: [{ field: 'document.first_publication_date', direction: 'desc' }],
  })
  return {
    next_page: response.next_page ? page + 1 : null,
    results: response.results.map((doc) => ({
      uid: doc.uid ?? doc.id,
      first_publication_date: doc.first_publication_date,
      data: {
        title: String(doc.data.title ?? ''),
        subtitle: String(doc.data.subtitle ?? ''),
        author: String(doc.data.author ?? ''),
      },
    })),
  }
}

export async function getPost(uid: string): Promise<Post | null> {
  const prismic = getPrismicClient()
  if (!prismic) return (fixtures as Post[]).find((p) => p.uid === uid) ?? null
  try {
    const doc = await prismic.getByUID('posts', uid)
    const data = doc.data as {
      title?: string
      subtitle?: string
      author?: string
      banner?: { url?: string }
      content?: Array<{ heading?: string; body?: RichTextField }>
    }
    return {
      uid: doc.uid ?? doc.id,
      first_publication_date: doc.first_publication_date,
      data: {
        title: data.title ?? '',
        subtitle: data.subtitle ?? '',
        author: data.author ?? '',
        banner: { url: data.banner?.url ?? '' },
        content: (data.content ?? []).map((c) => ({
          heading: c.heading ?? '',
          body: c.body ?? [],
        })),
      },
    }
  } catch {
    return null
  }
}

export async function listAllUids(): Promise<string[]> {
  const prismic = getPrismicClient()
  if (!prismic) return (fixtures as Post[]).map((p) => p.uid)
  const docs = await prismic.getAllByType('posts')
  return docs.map((d) => d.uid ?? d.id)
}

function listFixtures(page: number): PostPage {
  const all = [...(fixtures as Post[])].sort((a, b) =>
    b.first_publication_date.localeCompare(a.first_publication_date),
  )
  const start = (page - 1) * PAGE_SIZE
  const slice = all.slice(start, start + PAGE_SIZE)
  return {
    next_page: start + PAGE_SIZE < all.length ? page + 1 : null,
    results: slice.map((p): PostSummary => ({
      uid: p.uid,
      first_publication_date: p.first_publication_date,
      data: { title: p.data.title, subtitle: p.data.subtitle, author: p.data.author },
    })),
  }
}
