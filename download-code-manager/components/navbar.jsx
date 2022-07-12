import Link from 'next/link'
import { useCookies } from 'react-cookie'
import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from './navbar.module.css'

const adminOptionsList = [
  { href: '/AddArtist', title: 'Add Artist' },
  { href: '/AddLabel', title: 'Add Label' },
  { href: '/AddUser', title: 'Add User' },
  { href: '/UpdateArtist', title: 'Update Artist' },
  { href: '/UpdateAlbum', title: 'Update Album' },
  { href: '/UpdateUser', title: 'Update User' }
]

const userOptionsList = [
  { href: '/AddArtist', title: 'Add Artist' },
  { href: '/UpdateArtist', title: 'Update Artist' },
  { href: '/AddAlbum', title: 'Add Album' },
  { href: '/UpdateAlbum', title: 'Update Album' },
  { href: '/UpdateUser', title: 'Update User' },
  { href: '/UpdateLabel', title: 'Update Label' }
]

const Nav = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [auth, setAuth] = useState(false)
  const [user, setUser] = useState()
  const router = useRouter()
  useEffect(() => {
    if (cookies.user) {
      setAuth(true)
      setUser(cookies.user.user)
    } else {
      setAuth(false)
      setUser()
    }
  }, [cookies.user])
  let userOptions
  let adminOptions

  const handleLogout = () => {
    removeCookie('user', { path: '/' })

    router.push('/')
  }
  if (auth) {
    userOptions = (
      <>
        <li>
          <Link href={`/labels/${cookies.user.userLabelSlug}`}>
            <a>Label Page</a>
          </Link>
        </li>
        {userOptionsList.map(({ href, title }, index) => (
          <li key={index}>
            <Link href={href}>
              <a>{title}</a>
            </Link>
          </li>
        ))}
        <li>
          <button className="btn primary" onClick={() => handleLogout()}>
            Log out
          </button>
        </li>
      </>
    )

    adminOptions = (
      <>
        {adminOptionsList.map(({ href, title }, index) => (
          <li key={index}>
            <Link href={href}>
              <a>{title}</a>
            </Link>
          </li>
        ))}
        <li>
          <button className="btn primary" onClick={() => handleLogout()}>
            Log Out
          </button>
        </li>
      </>
    )
  }

  const publicOptions = (
    <li>
      <Link href="/SignIn">
        <a>Sign In</a>
      </Link>
    </li>
  )

  return (
    <>
      {user ? <div className={styles.greeting}>Hello {user.name}</div> : null}
      <nav className={styles.nav}>
        <ul className={styles.navbar}>
          {auth ? (user.isAdmin ? adminOptions : userOptions) : publicOptions}
        </ul>
      </nav>
    </>
  )
}
export default Nav
