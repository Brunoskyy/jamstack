import { ReactNode, useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): ReactNode {
  const { results, next_page } = postsPagination;

  console.log(postsPagination);

  const [isPaginated, setPagination] = useState(next_page);
  const [posts, setPosts] = useState<Post[]>(results);

  function handleNewPosts(newPostsUrl: string) {
    fetch(newPostsUrl)
      .then(response => response.json())
      .then(data => {
        const remainingPosts = data.results;
        setPosts([...posts, ...remainingPosts]);
        setPagination(data.next_page);
      });
  }

  return (
    <div className={styles.container}>
      {posts.map(post => (
        <Link href={`/post/${post.uid}`} key={`${post.uid}`}>
          <a className={styles.content}>
            <h1>{post.data.title}</h1>
            <p>{post.data.subtitle}</p>
            <div className={styles.postInfo}>
              <div>
                <FiCalendar />
                <time>{post.first_publication_date}</time>
              </div>
              <div>
                <FiUser />
                <p>{post.data.author}</p>
              </div>
            </div>
          </a>
        </Link>
      ))}
      {isPaginated && (
        <button type="button" onClick={() => handleNewPosts(next_page)}>
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetchLinks: ['posts.title', 'posts.subtitle'],
      pageSize: 5,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.last_publication_date),
        'dd mm yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: 'Artur',
      },
    } as Post;
  });

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
