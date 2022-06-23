import Link from 'next/link'
import { useCookies } from 'react-cookie'
import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const Nav = () => {
  const [cookies, setCookie, removeCookie] = useCookies('user')
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    if (cookies.userId) {
      setAuth(true)
    }
  }, [])
  let authenticatedOptions
  const handleLogout = () => {
    removeCookie('userId')
    Router.push('/')
  }
  if (auth) {
    authenticatedOptions = (
      <ul className="nav-bar">
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
