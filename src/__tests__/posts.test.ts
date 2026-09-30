import { describe, expect, it } from 'vitest'

import { getPost, listAllUids, listPosts, PAGE_SIZE } from '../services/posts'

describe('posts without Prismic', () => {
  it('pages through the fixtures newest first', async () => {
    const first = await listPosts(1)
    expect(first.results).toHaveLength(PAGE_SIZE)
    expect(first.next_page).toBe(2)
    expect(first.results[0]?.uid).toBe('tipagem-de-props')
    const second = await listPosts(2)
    expect(second.results.length).toBeGreaterThan(0)
    expect(second.next_page).toBeNull()
    const uids = [...first.results, ...second.results].map((p) => p.uid)
    expect(new Set(uids).size).toBe(uids.length)
    expect(uids).toHaveLength((await listAllUids()).length)
  })

  it('finds a post by uid and returns null for the rest', async () => {
    const post = await getPost('como-utilizar-hooks')
    expect(post?.data.title).toBe('Como utilizar Hooks')
    expect(post?.data.content[0]?.heading).toBe('Por que isso importa')
    expect(await getPost('nao-existe')).toBeNull()
  })
})
