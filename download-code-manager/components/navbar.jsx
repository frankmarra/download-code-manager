import Link from 'next/link'
import { useCookies } from 'react-cookie'
import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from './navbar.module.css'
// import axios from 'axios'
// import Client from '../services/api'

const adminOptionsList = {
  label: [
    { href: '/AddLabel', title: 'Add Label' },
    { href: '/UpdateLabel', title: 'Update Label' }
  ],
  user: [
    { href: '/AddUser', title: 'Add User' },
    { href: '/UpdateUser', title: 'Update User' }
  ],
  artist: [
    { href: '/AddArtist', title: 'Add Artist' },
    { href: '/UpdateArtist', title: 'Update Artist' }
  ],
  album: [
    { href: '/AddAlbum', title: 'Add Album' },
    { href: '/UpdateAlbum', title: 'Update Album' }
  ]
}

const userOptionsList = {
  label: [{ href: '/UpdateLabel', title: 'Update Label' }],
  artist: [
    { href: '/AddArtist', title: 'Add Artist' },
    { href: '/UpdateArtist', title: 'Update Artist' }
  ],
  album: [
    { href: '/AddAlbum', title: 'Add Album' },
    { href: '/UpdateAlbum', title: 'Update Album' }
  ],
  user: [{ href: '/UpdateUser', title: 'Update User' }]
}

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

  const handleLogout = async () => {
    removeCookie('user', { path: '/' })
    setAuth(false)
    router.push('/')
  }
  if (auth) {
    userOptions = (
      <>
        <li className="dropdown">
          <button className="btn primary">Label</button>
          <div className="dropdown-content">
            {userOptionsList.label.map(({ href, title }, index) => (
              <li key={index}>
                <Link href={href} key={index}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
          </div>
        </li>
        <li className="dropdown">
          <button className="btn primary">Artist</button>
          <div className="dropdown-content">
            {userOptionsList.artist.map(({ href, title }, index) => (
              <li key={index}>
                <Link href={href} key={index}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
          </div>
        </li>
        <li className="dropdown">
          <button className="btn primary">Album</button>
          <div className="dropdown-content">
            {userOptionsList.album.map(({ href, title }, index) => (
              <li key={index}>
                <Link href={href} key={index}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
          </div>
        </li>
        <li className="dropdown">
          <button className="btn primary">User</button>
          <div className="dropdown-content">
            {userOptionsList.user.map(({ href, title }, index) => (
              <li key={index}>
                <Link href={href} key={index}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
          </div>
        </li>
        <li>
          <button className="btn primary" onClick={() => handleLogout()}>
            Log out
          </button>
        </li>
      </>
    )

    adminOptions = (
      <>
        <li className="dropdown">
          <button className="btn primary">Label</button>
          <div className="dropdown-content">
            {adminOptionsList.label.map(({ href, title }, index) => (
              <li key={index}>
                <Link href={href} key={index}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
          </div>
        </li>
        <li className="dropdown">
          <button className="btn primary">Artist</button>
          <div className="dropdown-content">
            {adminOptionsList.artist.map(({ href, title }, index) => (
              <li key={index}>
                <Link href={href} key={index}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
          </div>
        </li>
        <li className="dropdown">
          <button className="btn primary">Album</button>
          <div className="dropdown-content">
            {adminOptionsList.album.map(({ href, title }, index) => (
              <li key={index}>
                <Link href={href} key={index}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
          </div>
        </li>
        <li className="dropdown">
          <button className="btn primary">User</button>
          <div className="dropdown-content">
            {adminOptionsList.user.map(({ href, title }, index) => (
              <li key={index}>
                <Link href={href} key={index}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
          </div>
        </li>
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
      {user ? (
        <div className={styles.greeting}>
          <p>
            Hello,
            <a href={`/labels/${cookies.user.userLabelSlug}`}> {user.name}</a>
          </p>
        </div>
      ) : null}
      <nav className={styles.nav}>
        <ul className={styles.navbar}>
          {auth ? (user.isAdmin ? adminOptions : userOptions) : publicOptions}
        </ul>
      </nav>
    </>
  )
}
export default Nav
