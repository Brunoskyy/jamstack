import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Header from '../components/Header'

describe('Header', () => {
  it('links the logo back to the home', () => {
    render(<Header />)
    const link = screen.getByRole('link', { name: 'spacetraveling' })
    expect(link).toHaveAttribute('href', '/')
    expect(link.querySelector('img')).toHaveAttribute('src', '/logo.svg')
  })
})
