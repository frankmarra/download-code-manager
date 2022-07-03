import '../styles/reset.css'
import '../styles/globals.css'
import { CookiesProvider } from 'react-cookie'
import Layout from '../components/layout'

function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CookiesProvider>
  )
}

export default MyApp
