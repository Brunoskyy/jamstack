import Link from 'next/link'

import styles from './header.module.scss'

export default function Header() {
  return (
    <Link href="/" className={styles.logo}>
      <img src="/logo.svg" alt="spacetraveling" />
    </Link>
  )
}
