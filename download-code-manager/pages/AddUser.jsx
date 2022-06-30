import { useState } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import Nav from '../components/navbar'

export async function getServerSideProps() {
  const res = await axios.get(`http://localhost:3001/api/labels`)
  const labels = res.data

  return { props: { labels } }
}

const AddUser = ({ labels }) => {
  const [cookies] = useCookies(['user'])
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

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post(
      `http://localhost:3001/api/auth/register`,
      formValues
    )
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
    <div className="add-user-page">
      <Nav />
      {userAdded ? (
        <div className="user-added-wrapper">
          <h1>New User Added</h1>
          <p>
            A user with the name {`${newUser.firstName}`}{' '}
            {`${newUser.lastName}`} was created.
          </p>
          <p>Would you like to add another user?</p>
          <button
            onClick={() => {
              toggleUserAdded(false)
            }}
          >
            Add Another User
          </button>
        </div>
      ) : (
        <div className="add-user-form-wrapper">
          <h1>Add New User</h1>
          <form className="add-new-user-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="firstName">User First Name:</label>
              <input
                onChange={handleChange}
                name="firstName"
                type="text"
                placeholder="First Name"
                value={formValues.firstName}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="lastName">User First Name:</label>
              <input
                onChange={handleChange}
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={formValues.lastName}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="email">User E-mail:</label>
              <input
                onChange={handleChange}
                name="email"
                type="email"
                value={formValues.email}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">Create Password:</label>
              <input
                onChange={handleChange}
                name="password"
                type="password"
                value={formValues.password}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="passwordCheck">Re-type Password:</label>
              <input
                onChange={handleChange}
                name="passwordCheck"
                type="password"
                value={formValues.passwordCheck}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="labelId">User Label:</label>
              <select name="labelId" onChange={handleChange}>
                <option value="">--Please choose a label</option>
                {labels.map((label) => (
                  <option value={label.id}>{label.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="add-user-button"
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
        </div>
      )}
    </div>
  )
}

export default AddUser
