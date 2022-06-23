import Link from 'next/link'
import { useCookies } from 'react-cookie'
import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const Nav = ({ cookies, removeCookie }) => {
  // const [cookies, setCookie, removeCookie] = useCookies('user')
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    if (cookies) {
      if (cookies.userId) {
        setAuth(true)
      }
    }
  }, [])
  let authenticatedOptions
  const handleLogout = () => {
    removeCookie('userId', { path: '/labels' })
    Router.push('/')
  }
  if (auth) {
    authenticatedOptions = (
      <ul className="nav-bar">
        <Link href="/AddArtist">
          <a>
            <li>Add Artist</li>
          </a>
        </Link>
        <li onClick={() => handleLogout()}>Log out</li>
      </ul>
    )
  }

  const publicOptions = (
    <ul className="nav-bar">
      <Link href="/SignIn">
        <a>
          <li>Sign In</li>
        </a>
      </Link>
    </ul>
  )

  return <nav>{auth ? authenticatedOptions : publicOptions}</nav>
}
export default Nav
