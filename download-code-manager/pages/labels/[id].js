import Head from 'next/head'
import Image from 'next/image'
import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import axios from 'axios'
import CodeGenerator from '../../components/CodeGenerator'
import AddCodes from '../../components/AddCodes'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import Nav from '../../components/navbar'

export async function getStaticPaths() {
  const res = await axios.get(`http://localhost:3001/api/labels`)
  const labels = res.data
  const paths = labels.map((label) => ({
    params: { id: label.id.toString() }
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const res = await axios.get(`http://localhost:3001/api/labels/${params.id}`)
  const label = res.data

  return { props: { label } }
}

export default function LabelPage({ label }) {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    if (cookies.userId) {
      if (cookies.userId.id === label.id) {
        setAuth(true)
      }
    }
  }, [label])

  return label ? (
    <Layout>
      <Head>
        <title>{label.name}</title>
      </Head>
      <header>
        <Nav cookies={cookies} removeCookie={removeCookie} />
      </header>
      <section>
        <a href={label.url}>
          <Image
            priority
            src={
              label.logo
                ? label.logo
                : `/download-code-manager/public/images/pexels-hermaion-104084.jpeg`
            }
            className={utilStyles.labelLogo}
            height={300}
            width={300}
            alt={label.name}
          />
        </a>
        <h1 className={utilStyles.labelName}>{label.name}</h1>
        {auth ? (
          <div>
            <h2>Add Codes</h2>
            <AddCodes artists={label.Artists} />
          </div>
        ) : (
          <div>
            <h3>Get Code</h3>
            <CodeGenerator
              artists={label.Artists}
              redeemLink={label.redeemLink}
            />
          </div>
        )}
      </section>
    </Layout>
  ) : (
    <div>Loading...</div>
  )
}
