// import Head from 'next/head'
// import Link from 'next/link'
import styles from '../styles/Home.module.css'
// import { useState } from 'react'
// import Nav from '../components/navbar'

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Download Code Manager</h1>
        <h2>
          <a
            href="mailto:mysterycircles@gmail.com?subject=I%20am%20interested%20in%20joining"
            target="_blank"
            rel="noopener"
          >
            Interested in joining?{' '}
          </a>
        </h2>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  )
}
