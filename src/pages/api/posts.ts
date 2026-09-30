import type { NextApiRequest, NextApiResponse } from 'next'

import type { PostPage } from '../../lib/types'
import { listPosts } from '../../services/posts'

/** The "load more" endpoint: one page of posts, whichever source is configured. */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostPage | { error: string }>,
) {
  const page = Number(req.query.page ?? 1)
  if (!Number.isInteger(page) || page < 1)
    return res.status(400).json({ error: 'page must be a positive integer' })
  res.setHeader('cache-control', 'public, max-age=60')
  res.status(200).json(await listPosts(page))
}
