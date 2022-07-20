import { useEffect, useState } from 'react'
import axios from 'axios'
import { parseCookies } from '../helpers'
import { useRouter } from 'next/router'
import { UpdateUserPassword } from '../services/Auth'
import Client from '../services/api'

export async function getServerSideProps({ req }) {
  const cookieString = parseCookies(req)
  const cookies = JSON.parse(cookieString.user)
  const res = await Client.get(`/users/${cookies.user.id}`)
  const userInfo = res.data

  return { props: { user: cookies, userInfo } }
}

const UpdatePassword = ({ user, userInfo }) => {
  const [formValues, setFormValues] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordCheck: ''
  })
  const [updated, setUpdated] = useState(false)
  const [updateError, setUpdateError] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedUser = {
      userId: userInfo.id,
      oldPassword: formValues.oldPassword,
      newPassword: formValues.newPassword
    }
    const res = await UpdateUserPassword(updatedUser)
    if (res == 'ERROR') {
      setFormValues({
        oldPassword: '',
        newPassword: '',
        newPasswordCheck: ''
      })
      setUpdateError(true)
    }
  }

  return (
    <section className="form-container">
      {updated ? (
        <div className="updated-user-message u-flow">
          <h3>User password updated.</h3>
        </div>
      ) : (
        <div className="update-user-password-form-wrapper u-flow">
          <h1>Update Password</h1>
          <form
            className="update-user-password-form u-flow"
            onSubmit={handleSubmit}
          >
            <div className="input-wrapper">
              <label htmlFor="oldPassword">Current Password</label>
              <input
                onChange={handleChange}
                id="oldPassword"
                type="password"
                value={formValues.oldPassword}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="newPassword">New Password</label>
              <input
                onChange={handleChange}
                id="newPassword"
                type="password"
                value={formValues.newPassword}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="newPasswordCheck">Re-enter New Password</label>
              <input
                onChange={handleChange}
                id="newPasswordCheck"
                type="password"
                value={formValues.newPasswordCheck}
                required
              />
            </div>
            <button
              type="submit"
              className="btn primary"
              disabled={
                !formValues.oldPassword ||
                !formValues.newPassword ||
                !formValues.newPasswordCheck ||
                formValues.newPassword != formValues.newPasswordCheck
              }
            >
              Update Password
            </button>
          </form>
          <button
            className="btn secondary"
            onClick={() => {
              user.user.labelId == null
                ? router.push('/')
                : router.push(`/labels/${user.user.labelId}`)
            }}
          >
            Cancel
          </button>
          {updateError ? (
            <h3>You have entered the wrong password. Please try again.</h3>
          ) : null}
        </div>
      )}
    </section>
  )
}

export default UpdatePassword
