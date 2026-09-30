import { asHTML } from '@prismicio/client'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi'

import Header from '../../components/Header'
import { formatDate, readingTime } from '../../lib/format'
import type { Post } from '../../lib/types'
import { getPost, listAllUids } from '../../services/posts'
import commonStyles from '../../styles/common.module.scss'
import styles from './post.module.scss'

interface PostProps {
  post: Post
}

export default function PostPage({ post }: PostProps) {
  const router = useRouter()
  if (router.isFallback) return <p className={styles.container}>Carregando...</p>

  const { first_publication_date, data } = post
  const minutes = readingTime(data.content)

  return (
    <>
      <Head>
        <title>{`${data.title} | spacetraveling`}</title>
      </Head>
      <Header />
      {data.banner.url && <img className={styles.image} src={data.banner.url} alt="" />}
      <main className={styles.container}>
        <h1>{data.title}</h1>
        <div className={commonStyles.postInfo}>
          <div>
            <FiCalendar />
            <time dateTime={first_publication_date}>{formatDate(first_publication_date)}</time>
          </div>
          <div>
            <FiUser />
            <p>{data.author}</p>
          </div>
          <div>
            <FiClock />
            <p>{minutes} min</p>
          </div>
        </div>

        {data.content.map((section, i) => (
          <article className={styles.content} key={`${section.heading}-${i}`}>
            <h2>{section.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: asHTML(section.body) }} />
          </article>
        ))}
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const uids = await listAllUids()
  return { paths: uids.map((slug) => ({ params: { slug } })), fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const post = await getPost(String(params?.slug))
  if (!post) return { notFound: true, revalidate: 60 }
  return { props: { post }, revalidate: 60 }
}
