import type { RichTextField } from '@prismicio/client'

export interface PostSummary {
  uid: string
  first_publication_date: string
  data: {
    title: string
    subtitle: string
    author: string
  }
}

export interface PostContent {
  heading: string
  body: RichTextField
}

export interface Post extends PostSummary {
  data: PostSummary['data'] & {
    banner: { url: string }
    content: PostContent[]
  }
}

export interface PostPage {
  next_page: number | null
  results: PostSummary[]
}
