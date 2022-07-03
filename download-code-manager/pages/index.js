import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Nav from '../components/navbar'

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Download Code Manager</h1>
        <h2>Coming Soon!</h2>
        <h3>Your one stop shop for code storage and dispersal!</h3>
        <h4>
          Interested in joining? Send us an <span>Email!</span>
        </h4>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  )
}
