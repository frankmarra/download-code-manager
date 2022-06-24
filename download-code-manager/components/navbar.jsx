import Link from 'next/link'
import { useCookies } from 'react-cookie'
import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const Nav = () => {
  const [cookies, removeCookie] = useCookies('user')
  const [auth, setAuth] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (cookies) {
      if (cookies.user) {
        setAuth(true)
      }
    }
  }, [])

  const handleLogout = () => {
    removeCookie('user', { path: '/' })
    router.push('/')
  }

  const authenticatedOptions = (
    <ul className="nav-bar">
      <Link href="/AddArtist">
        <a>
          <li>Add Artist</li>
        </a>
      </Link>
      <li onClick={() => handleLogout()}>Log out</li>
    </ul>
  )

  const adminOptions = (
    <ul className="nav-bar">
      <Link href="/AddArtist">
        <a>
          <li>Add Artist</li>
        </a>
      </Link>

      <Link href="/AddLabel">
        <a>
          <li>Add Label</li>
        </a>
      </Link>
      <Link href="/AddUser">
        <a>
          <li>Add User</li>
        </a>
      </Link>

      <li onClick={() => handleLogout()}>Log out</li>
    </ul>
  )

  const publicOptions = (
    <ul className="nav-bar">
      <Link href="/SignIn">
        <a>
          <li>Sign In</li>
        </a>
      </Link>
    </ul>
  )

  return (
    <nav>
      {auth
        ? cookies.user.user.isAdmin
          ? adminOptions
          : authenticatedOptions
        : publicOptions}
    </nav>
  )
}
export default Nav
