import { useState } from 'react'
import axios from 'axios'
import { parseCookies } from '../helpers'
import { useRouter } from 'next/router'
import Client from '../services/api'

export async function getServerSideProps({ req }) {
  const cookieString = parseCookies(req)
  const cookies = JSON.parse(cookieString.user)
  const res = await Client.get(`/labels`)
  const labels = res.data

  return { props: { user: cookies, labels } }
}

const AddUser = ({ labels, user }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    labelId: 0,
    artistId: 0
  })
  const [userAdded, toggleUserAdded] = useState(false)
  const [newUser, setNewUser] = useState()
  const router = useRouter()
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await Client.post(`/auth/register`, formValues)
    setNewUser(res.data)
    setFormValues({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordCheck: '',
      labelId: 0,
      artistId: 0
    })
    toggleUserAdded(true)
  }

  return (
    <div className="form-container">
      {userAdded ? (
        <div className="user-added-wrapper u-flow">
          <h1>New User Added</h1>
          <p>
            A user with the name {`${newUser.firstName}`}{' '}
            {`${newUser.lastName}`} was created.
          </p>
          <p>Would you like to add another user?</p>
          <button
            className="btn primary"
            onClick={() => {
              toggleUserAdded(false)
            }}
          >
            Add Another User
          </button>
        </div>
      ) : (
        <div className="add-user-form-wrapper u-flow">
          <h1>Add New User</h1>
          <form className="add-new-user-form u-flow" onSubmit={handleSubmit}>
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
            <div className="input-wrapper">
              <label htmlFor="password">Create Password</label>
              <input
                onChange={handleChange}
                id="password"
                type="password"
                value={formValues.password}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="passwordCheck">Re-type Password</label>
              <input
                onChange={handleChange}
                id="passwordCheck"
                type="password"
                value={formValues.passwordCheck}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="labelId">User Label:</label>
              <select id="labelId" onChange={handleChange}>
                <option value="">--Please choose a label</option>
                {labels.map((label) => (
                  <option value={label.id}>{label.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn primary"
              disabled={
                !formValues.firstName ||
                !formValues.email ||
                !formValues.lastName ||
                !formValues.password ||
                formValues.password != formValues.passwordCheck
              }
            >
              Add User
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
        </div>
      )}
    </div>
  )
}

export default AddUser
