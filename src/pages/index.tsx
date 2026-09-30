import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { FiCalendar, FiUser } from 'react-icons/fi'

import Header from '../components/Header'
import { formatDate } from '../lib/format'
import type { PostPage, PostSummary } from '../lib/types'
import { listPosts } from '../services/posts'
import commonStyles from '../styles/common.module.scss'
import styles from './home.module.scss'

interface HomeProps {
  postsPagination: PostPage
  usingFixtures: boolean
}

export default function Home({ postsPagination, usingFixtures }: HomeProps) {
  const [posts, setPosts] = useState<PostSummary[]>(postsPagination.results)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)
  const [loading, setLoading] = useState(false)

  async function loadMore() {
    if (!nextPage) return
    setLoading(true)
    try {
      const res = await fetch(`/api/posts?page=${nextPage}`)
      const data = (await res.json()) as PostPage
      setPosts((current) => [...current, ...data.results])
      setNextPage(data.next_page)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <Header />

      {usingFixtures && (
        <p className={styles.notice}>Sem Prismic configurado: mostrando posts de exemplo.</p>
      )}

      {posts.length === 0 && <p className={styles.notice}>Nenhum post publicado ainda.</p>}

      {posts.map((post) => (
        <Link href={`/post/${post.uid}`} key={post.uid} className={styles.content}>
          <h1>{post.data.title}</h1>
          <p>{post.data.subtitle}</p>
          <div className={commonStyles.postInfo}>
            <div>
              <FiCalendar />
              <time dateTime={post.first_publication_date}>
                {formatDate(post.first_publication_date)}
              </time>
            </div>
            <div>
              <FiUser />
              <p>{post.data.author}</p>
            </div>
          </div>
        </Link>
      ))}

      {nextPage && (
        <button type="button" onClick={() => void loadMore()} disabled={loading}>
          {loading ? 'Carregando…' : 'Carregar mais posts'}
        </button>
      )}
    </div>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const postsPagination = await listPosts(1)
  return {
    props: { postsPagination, usingFixtures: !process.env.PRISMIC_API_ENDPOINT },
    revalidate: 60,
  }
}
