import Head from 'next/head'
import Image from 'next/image'
import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import axios from 'axios'
import CodeGenerator from '../../components/CodeGenerator'
import AddCodes from '../../components/AddCodes'
import { useCookies } from 'react-cookie'
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

  const auth = cookies.userId

  return label ? (
    <Layout>
      <Head>
        <title>{label.labelName}</title>
      </Head>
      <header>
        <Nav />
      </header>
      <section>
        <a href={label.labelWebsite}>
          <Image
            priority
            src={
              label.labelLogo
                ? label.labelLogo
                : `/download-code-manager/public/images/pexels-hermaion-104084.jpeg`
            }
            className={utilStyles.labelLogo}
            height={300}
            width={300}
            alt={label.labelName}
          />
        </a>
        <h1 className={utilStyles.labelName}>{label.labelName}</h1>
        {auth ? (
          <AddCodes artists={label.Artists} />
        ) : (
          <CodeGenerator artists={label.Artists} />
        )}
      </section>
    </Layout>
  ) : (
    <div>Loading...</div>
  )
}
