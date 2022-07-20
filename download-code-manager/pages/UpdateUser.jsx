import { useEffect, useState } from 'react'
import axios from 'axios'
import { parseCookies } from '../helpers'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Client from '../services/api'

export async function getServerSideProps({ req }) {
  const cookieString = parseCookies(req)
  const cookies = JSON.parse(cookieString.user)
  const res = await Client.get(`/users/${cookies.user.id}`)
  const userInfo = res.data

  return { props: { user: cookies, userInfo } }
}

const UpdateUser = ({ user, userInfo }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const router = useRouter()

  useEffect(() => {
    userInfo
      ? setFormValues({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email
        })
      : setFormValues({
          firstName: '',
          lastName: '',
          email: ''
        })
  }, [])

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await Client.put(`/users/${user.user.id}`, formValues)
    user.user.labelId == null
      ? router.push('/')
      : router.push(`/labels/${user.userLabelSlug}`)
  }

  return (
    <section className="form-container u-flow">
      <div className="update-user-form-wrapper u-flow">
        <h1>Update User</h1>
        <form className="update-user-form u-flow" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="firstName">First Name</label>
            <input
              onChange={handleChange}
              id="firstName"
              type="text"
              value={formValues.firstName}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="lastName">Last Name</label>
            <input
              onChange={handleChange}
              id="lastName"
              type="text"
              value={formValues.lastName}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="email">E-mail</label>
            <input
              onChange={handleChange}
              id="email"
              type="email"
              value={formValues.email}
              required
            />
          </div>
          <button
            type="submit"
            className="btn primary"
            disabled={
              !formValues.firstName || !formValues.lastName || !formValues.email
            }
          >
            Update User
          </button>
        </form>
        <button
          className="btn secondary"
          onClick={() => {
            user.user.labelId == null
              ? router.push('/')
              : router.push(`/labels/${user.userLabelSlug}`)
          }}
        >
          Cancel
        </button>
      </div>
      <div>
        <Link href={'/UpdatePassword'}>
          <a className="btn primary">Update Password?</a>
        </Link>
      </div>
    </section>
  )
}

export default UpdateUser
