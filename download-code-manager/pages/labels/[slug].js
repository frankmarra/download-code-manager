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
  const [codeAuth, setCodeAuth] = useState(false)
  const [signinError, setSigninError] = useState(false)
  const [generatorPasswordValue, setGeneratorPasswordValue] = useState({
    pagePassword: ''
  })
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

  const handleGeneratorPasswordChange = (e) => {
    setGeneratorPasswordValue({
      ...generatorPasswordValue,
      [e.target.id]: e.target.value
    })
  }

  const handleGeneratorPasswordSubmit = (e) => {
    e.preventDefault()
    if (label.pagePassword == generatorPasswordValue.pagePassword) {
      setCodeAuth(true)
      setSigninError(false)
    } else {
      setSigninError(true)
      document.getElementById('generator-password-form').reset()
    }
  }

  return label ? (
    <>
      <Head>
        <title>{label.name}</title>
        <script
          src="https://kit.fontawesome.com/ae0d597aae.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <section className="u-flex-column">
        <a href={label.url}>
          {label.logo ? (
            <img
              src={label.logo}
              className={utilStyles.labelLogo}
              height={200}
              width={200}
              alt={label.name}
            />
          ) : null}
        </a>
        <h1 className={utilStyles.labelName}>{label.name}</h1>
        {auth ? (
          <div className="add-codes">
            <AddCodes artists={label.Artists} />
          </div>
        ) : !label.pagePassword || codeAuth == true ? (
          <div className="code-generator u-flow">
            <CodeGenerator
              labelId={label.id}
              labelSlug={label.slug}
              artists={label.Artists}
              redeemLink={label.redeemLink}
              pagePassword={label.pagePassword}
            />
          </div>
        ) : (
          <section className="form-container">
            <div id="generator-password" className="u-flex-column u-flow">
              <h1>Enter Password for to access codes</h1>
              <form
                className="generator-password-form u-flex-column u-flow"
                id="generator-password-form"
                onSubmit={handleGeneratorPasswordSubmit}
              >
                <div className="input-wrapper">
                  <label htmlFor="pagePassword">Password</label>
                  <input
                    onChange={handleGeneratorPasswordChange}
                    id="pagePassword"
                    type="password"
                    value={generatorPasswordValue.pagePassword}
                    required
                  />
                  <button
                    type="submit"
                    className="btn primary"
                    disabled={!generatorPasswordValue.pagePassword}
                  >
                    Sign In
                  </button>
                </div>
              </form>
              {signinError ? (
                <h3>You have entered the wrong password. Please try again.</h3>
              ) : null}
            </div>
          </section>
        )}
      </section>
    </>
  ) : (
    <div>Loading...</div>
  )
}
