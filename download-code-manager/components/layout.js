import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className={styles.mainWrapper}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="label page"
          content="Select artist and album to generate a free album download code"
        />
      </Head>
      <main>{children}</main>
    </div>
  )
}
