import { asText, type RichTextField } from '@prismicio/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const WORDS_PER_MINUTE = 200

/**
 * `15 mar 2021`, the way the layout writes dates. Prismic stamps publication
 * in UTC; the calendar day is taken in UTC too, so the same post shows the
 * same date whatever machine rendered it.
 */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  const utcAsLocal = new Date(d.getTime() + d.getTimezoneOffset() * 60_000)
  return format(utcAsLocal, 'dd MMM yyyy', { locale: ptBR })
}

/** Minutes to read, rounded up, from every section's plain text. */
export function readingTime(content: Array<{ body: RichTextField }>): number {
  const words = content.reduce((total, section) => {
    const text = asText(section.body).trim()
    return total + (text ? text.split(/\s+/).length : 0)
  }, 0)
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
