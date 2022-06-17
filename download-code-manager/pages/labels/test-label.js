import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import CodeGenerator from '../../components/CodeGenerator'
import AddCodes from '../../components/AddCodes'

export default function TestLabel({ activeLabel }) {
  const [label, setLabel] = useState()

  useEffect(() => {
    const getLabelDetails = async () => {
      const res = await axios.get(`http://localhost:3001/api/labels/1`)
      setLabel(res.data)
    }
    getLabelDetails()
  }, [])

  return label ? (
    <Layout>
      <Head>
        <title>{label.labelName}</title>
      </Head>

      <section>
        <Image
          priority
          src="/images/MC black logo.png"
          className={utilStyles.labelLogo}
          height={300}
          width={300}
        />
        <h1 className={utilStyles.labelName}>{label.labelName}</h1>
        <h2>
          <Link href="/">
            <a>Home</a>
          </Link>
        </h2>
      </section>
      <CodeGenerator artists={label.Artists} />
      <AddCodes artists={label.Artists} />
    </Layout>
  ) : (
    <div>Loading...</div>
  )
}
