import Link from 'next/link'
import { useCookies } from 'react-cookie'
import Router, { useRouter } from 'next/router'

const Nav = () => {
  const [cookies, setCookie, removeCookie] = useCookies('user')
  let authenticatedOptions
  let auth = cookies.userId

  const handleLogout = () => {
    removeCookie('userId')
    Router.push('/')
    // window.location.reload()
  }
  if (auth) {
    authenticatedOptions = (
      <ul className="nav-bar">
        <li>Add Artist</li>
        <li>Add Album</li>
        <li>Add Codes</li>
        <li onClick={() => handleLogout()}>Log out</li>
      </ul>
    )
  }

  const publicOptions = (
    <ul className="nav-bar">
      <li>Register</li>
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
