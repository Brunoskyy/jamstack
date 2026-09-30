import { describe, expect, it } from 'vitest'

import type { RichTextField } from '@prismicio/client'

import { formatDate, readingTime } from '../lib/format'

describe('formatDate', () => {
  it('writes the date in Portuguese, day month year', () => {
    expect(formatDate('2021-03-15T19:25:28+0000')).toBe('15 mar 2021')
    expect(formatDate('2021-12-01T00:00:00+0000')).toBe('01 dez 2021')
  })
})

describe('readingTime', () => {
  const words = (n: number) =>
    [
      { type: 'paragraph', text: Array(n).fill('palavra').join(' '), spans: [] },
    ] as unknown as RichTextField

  it('rounds up at 200 words per minute across sections', () => {
    expect(readingTime([{ body: words(200) }])).toBe(1)
    expect(readingTime([{ body: words(201) }])).toBe(2)
    expect(readingTime([{ body: words(150) }, { body: words(150) }])).toBe(2)
  })

  it('never shows zero minutes', () => {
    expect(readingTime([])).toBe(1)
    expect(readingTime([{ body: [] }])).toBe(1)
  })
})
