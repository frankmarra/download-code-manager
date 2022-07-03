import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import Link from 'next/link'
import Nav from './navbar'

export default function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="label page"
          content="Select artist and album to generate a free album download code"
        />
      </Head>
      <header className={styles.header}>
        <Nav />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
