import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'
import ArtistCodeGenerator from '../../components/ArtistCodeGenerator'
import AddCodes from '../../components/AddCodes'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import Client from '../../services/api'
import { useRouter } from 'next/router'

export async function getServerSideProps({ params }) {
  const res = await Client.get(`/artist/${params.slug}`)
  const artist = res.data

  return { props: { artist } }
}

export default function ArtistPage({ artist }) {
  const [cookies] = useCookies(['user'])
  const [auth, setAuth] = useState(false)
  const [codeAuth, setCodeAuth] = useState(false)
  const [signinError, setSigninError] = useState(false)
  const [generatorPasswordValue, setGeneratorPasswordValue] = useState({
    pagePassword: ''
  })
  const router = useRouter()

  useEffect(() => {
    if (cookies.user) {
      if (
        cookies.user.user.labelId === artist.labelId ||
        cookies.user.user.isAdmin
      ) {
        setAuth(true)
      }
    }
  }, [artist])

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
    if (artist.pagePassword == generatorPasswordValue.pagePassword) {
      setCodeAuth(true)
      setSigninError(false)
    } else {
      setSigninError(true)
      document.getElementById('generator-password-form').reset()
    }
  }

  return artist ? (
    <>
      <Head>
        <title>{artist.name}</title>
        <script
          src="https://kit.fontawesome.com/ae0d597aae.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <section className="u-flex-column">
        <a href={artist.url}>
          {artist.logo ? (
            <img
              src={artist.logo}
              className={utilStyles.labelLogo}
              height={200}
              width={200}
              alt={artist.name}
            />
          ) : null}
        </a>
        <h1 className={utilStyles.labelName}>
          {artist.displayName ? artist.displayName : artist.name}
        </h1>
        {!artist.pagePassword || codeAuth == true ? (
          <div className="code-generator u-flow">
            <ArtistCodeGenerator
              labelId={artist.labelId}
              artistId={artist.id}
              albums={artist.Albums}
              redeemLink={artist.redeemLink}
            />
          </div>
        ) : (
          <section className="form-container">
            <div id="generator-password" className="u-flex-column u-flow">
              <form
                className="generator-password-form u-flex-column u-flow"
                id="generator-password-form"
                onSubmit={handleGeneratorPasswordSubmit}
              >
                <div className="input-wrapper u-flow">
                  <label htmlFor="pagePassword">
                    Enter password to access codes
                  </label>
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
