import Link from 'next/link'
import { useCookies } from 'react-cookie'
import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const Nav = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [auth, setAuth] = useState(false)
  const [user, setUser] = useState()
  const router = useRouter()
  useEffect(() => {
    if (cookies.user) {
      setAuth(true)
      setUser(cookies.user.user)
    }
  }, [cookies])
  let authenticatedOptions
  let adminOptions
  const handleLogout = () => {
    removeCookie('user', { path: '/' })
    router.reload()
  }
  if (auth) {
    authenticatedOptions = (
      <ul className="nav-bar">
        <li>Hello {user.name}</li>
        <Link href="/AddArtist">
          <a>
            <li>Add Artist</li>
          </a>
        </Link>
        <Link href="/">
          <a>
            <li onClick={() => handleLogout()}>Log out</li>
          </a>
        </Link>
      </ul>
    )

    adminOptions = (
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
        <Link href="/">
          <a>
            <li onClick={() => handleLogout()}>Log out</li>
          </a>
        </Link>
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

  return (
    <nav>
      {auth
        ? user.isAdmin
          ? adminOptions
          : authenticatedOptions
        : publicOptions}
    </nav>
  )
}
export default Nav
