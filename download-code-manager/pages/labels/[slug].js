import Head from 'next/head'
// import Image from 'next/image'
// import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
// import axios from 'axios'
import CodeGenerator from '../../components/CodeGenerator'
import AddCodes from '../../components/AddCodes'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import Client from '../../services/api'
import { useRouter } from 'next/router'

// export async function getStaticPaths() {
//   // if (process.env.SKIP_BUILD_STATIC_GENERATION) {
//   //   return {
//   //     paths: [],
//   //     fallback: 'blocking'
//   //   }
//   // }

//   const res = await Client.get(`/labels`)
//   const labels = res.data
//   let paths = labels.map((label) => ({
//     params: { slug: label.slug }
//   }))

//   return { paths, fallback: true }
// }

// export async function getStaticProps({ params }) {
//   const res = await Client.get(`/labels/${params.slug}`)
//   const label = res.data

//   return { props: { label }, revalidate: 10 }
// }

export async function getServerSideProps({ params }) {
  const res = await Client.get(`/labels/${params.slug}`)
  const label = res.data

  return { props: { label } }
}

export default function LabelPage({ label }) {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [auth, setAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (cookies.user) {
      if (cookies.user.user.labelId === label.id || cookies.user.user.isAdmin) {
        setAuth(true)
      }
    }
  }, [label])

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return label ? (
    <>
      <Head>
        <title>{label.name}</title>
      </Head>
      <section className="u-flex-column">
        <a href={label.url}>
          <img
            src={
              label.logo ? label.logo : `/images/pexels-hermaion-104084.jpeg`
            }
            className={utilStyles.labelLogo}
            height={200}
            width={200}
            alt={label.name}
          />
        </a>
        <h1 className={utilStyles.labelName}>{label.name}</h1>
        {auth ? (
          <div className="add-codes">
            <AddCodes artists={label.Artists} />
          </div>
        ) : (
          <div className="code-generator u-flow">
            <h3>Generate Album Code:</h3>
            <CodeGenerator
              labelId={label.id}
              labelSlug={label.slug}
              artists={label.Artists}
              redeemLink={label.redeemLink}
            />
          </div>
        )}
      </section>
    </>
  ) : (
    <div>Loading...</div>
  )
}
