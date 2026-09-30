import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Home from '../pages/index'

const page1 = {
  next_page: 2,
  results: [
    {
      uid: 'como-utilizar-hooks',
      first_publication_date: '2021-03-15T19:25:28+0000',
      data: {
        title: 'Como utilizar Hooks',
        subtitle: 'Pensando em sincronização',
        author: 'Joseph Oliveira',
      },
    },
    {
      uid: 'criando-um-app-cra-do-zero',
      first_publication_date: '2021-03-25T19:27:35+0000',
      data: {
        title: 'Criando um app CRA do zero',
        subtitle: 'Tudo sobre CRA',
        author: 'Danilo Vieira',
      },
    },
  ],
}
const page2 = {
  next_page: null,
  results: [
    {
      uid: 'terceiro',
      first_publication_date: '2021-04-02T12:00:00+0000',
      data: { title: 'Terceiro post', subtitle: 'Sub', author: 'Ana Lima' },
    },
  ],
}

afterEach(() => vi.restoreAllMocks())

describe('Home', () => {
  it('lists posts with title, subtitle, author and a Portuguese date', () => {
    render(<Home postsPagination={page1} usingFixtures={false} />)
    expect(screen.getByRole('link', { name: /Como utilizar Hooks/ })).toHaveAttribute(
      'href',
      '/post/como-utilizar-hooks',
    )
    expect(screen.getByText('Pensando em sincronização')).toBeInTheDocument()
    expect(screen.getByText('Joseph Oliveira')).toBeInTheDocument()
    expect(screen.getByText('15 mar 2021')).toBeInTheDocument()
    expect(screen.getByText('25 mar 2021')).toBeInTheDocument()
  })

  it('loads the next page from the API and hides the button at the end', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(page2), { status: 200 }))
    render(<Home postsPagination={page1} usingFixtures={false} />)
    await user.click(screen.getByRole('button', { name: 'Carregar mais posts' }))
    expect(fetchSpy).toHaveBeenCalledWith('/api/posts?page=2')
    await waitFor(() => expect(screen.getByText('Terceiro post')).toBeInTheDocument())
    expect(document.querySelectorAll('a[href^="/post/"]')).toHaveLength(3)
    expect(screen.queryByRole('button', { name: 'Carregar mais posts' })).toBeNull()
  })

  it('has no button when there is no next page, and says when fixtures are in use', () => {
    render(<Home postsPagination={{ ...page1, next_page: null }} usingFixtures />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByText(/posts de exemplo/)).toBeInTheDocument()
  })

  it('says so when there are no posts at all', () => {
    render(<Home postsPagination={{ next_page: null, results: [] }} usingFixtures={false} />)
    expect(screen.getByText('Nenhum post publicado ainda.')).toBeInTheDocument()
  })
})
