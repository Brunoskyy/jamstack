import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { RichTextField } from '@prismicio/client'

import type { Post } from '../lib/types'
import PostPage from '../pages/post/[slug]'

const paragraph = (text: string) => ({ type: 'paragraph' as const, text, spans: [] })
const body = (...paragraphs: ReturnType<typeof paragraph>[]) =>
  paragraphs as unknown as RichTextField
const post: Post = {
  uid: 'como-utilizar-hooks',
  first_publication_date: '2021-03-15T19:25:28+0000',
  data: {
    title: 'Como utilizar Hooks',
    subtitle: 'Pensando em sincronização',
    author: 'Joseph Oliveira',
    banner: { url: '/cover.png' },
    content: [
      { heading: 'Proin et varius', body: body(paragraph(Array(250).fill('palavra').join(' '))) },
      {
        heading: 'Cras laoreet',
        body: body(paragraph('Curta.'), paragraph('Outro <b>parágrafo</b>.')),
      },
    ],
  },
}

describe('Post', () => {
  it('shows the title, author, date and reading time', () => {
    render(<PostPage post={post} />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Como utilizar Hooks' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Joseph Oliveira')).toBeInTheDocument()
    expect(screen.getByText('15 mar 2021')).toBeInTheDocument()
    // 250 + 4 words at 200 per minute, rounded up.
    expect(screen.getByText('2 min')).toBeInTheDocument()
  })

  it('renders every section with its heading and escaped body', () => {
    render(<PostPage post={post} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Proin et varius' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Cras laoreet' })).toBeInTheDocument()
    expect(screen.getByText('Outro <b>parágrafo</b>.')).toBeInTheDocument()
    expect(document.querySelector('b')).toBeNull()
  })

  it('has the banner and the document title', () => {
    render(<PostPage post={post} />)
    expect(document.querySelector('img[src="/cover.png"]')).not.toBeNull()
  })
})
