import Link from 'next/link'

const Nav = ({ authenticated, activeLabel, handleLogOut }) => {
  let authenticatedOptions
  if (activeLabel) {
    authenticatedOptions = (
      <ul className="nav-bar">
        <li>Add Artist</li>
        <li>Add Album</li>
        <li>Add Codes</li>
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

  return (
    <nav>
      {authenticated && activeLabel ? authenticatedOptions : publicOptions}
    </nav>
  )
}
export default Nav
