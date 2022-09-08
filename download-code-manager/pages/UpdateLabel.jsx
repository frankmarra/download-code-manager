import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { useRouter } from 'next/router'
import { parseCookies } from '../helpers'
import Client from '../services/api'

export async function getServerSideProps({ req }) {
  const cookieString = parseCookies(req)
  const cookies = JSON.parse(cookieString.user)
  const res = await Client.get(`/labels/${cookies.userLabelSlug}`)
  const label = res.data

  return {
    props: { user: cookies, label: label }
  }
}

const UpdateLabel = ({ user, label }) => {
  const [cookies] = useCookies(['user'])
  const [formValues, setFormValues] = useState({
    displayName: label
      ? label.displayName
        ? label.displayName
        : label.name
      : '',
    email: label ? label.email : '',
    url: label ? label.url : '',
    logo: label ? label.logo : '',
    pagePassword: label ? label.pagePassword : '',
    redeemLink: label ? label.redeemLink : ''
  })
  const router = useRouter()

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await Client.put(`/labels/${user.user.labelId}`, formValues)
    user.user.labelId == null
      ? router.push('/')
      : router.push(`/labels/${user.userLabelSlug}`)
  }

  return (
    <div className="form-container">
      {label && (
        <div className="update-label-form-wrapper u-flow">
          <h1>Update {`${label.name}`}</h1>
          <form className="update-label-form u-flow" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="displayName">
                Label Name (This does not effect the label URL)
              </label>
              <input
                onChange={handleChange}
                id="displayName"
                type="text"
                value={formValues.displayName}
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
            <div className="input-wrapper">
              <label htmlFor="url">URL</label>
              <input
                onChange={handleChange}
                id="url"
                type="text"
                value={formValues.url}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="logo">Logo</label>
              <input
                onChange={handleChange}
                id="logo"
                type="text"
                value={formValues.logo}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="pagePassword">
                Password to access code generator (Leave blank if you do not
                want to password protect your codes)
              </label>
              <input
                onChange={handleChange}
                id="pagePassword"
                type="text"
                value={formValues.pagePassword}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="redeemLink">Redemption Link</label>
              <input
                onChange={handleChange}
                id="redeemLink"
                type="text"
                value={formValues.redeemLink}
              />
            </div>
            <button type="submit" className="btn primary">
              Update Label
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
      )}
    </div>
  )
}

export default UpdateLabel
