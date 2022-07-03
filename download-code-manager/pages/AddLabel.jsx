import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { parseCookies } from '../helpers'

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req)

  return {
    props: { user: JSON.parse(cookies.user) }
  }
}

const AddLabel = ({ user }) => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: ''
  })
  const [labelAdded, toggleLabelAdded] = useState(false)
  const [newLabel, setNewLabel] = useState()
  const router = useRouter()
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post(`http://localhost:3001/api/labels`, formValues)
    setNewLabel(res.data)
    setFormValues({ name: '', email: '' })
    toggleLabelAdded(true)
  }

  return (
    <div className="form-container">
      {labelAdded ? (
        <div className="label-added-wrapper u-flow">
          <h1>New Label Added</h1>
          <p>A label with the name {`${newLabel.name}`} was created.</p>
          <p>Would you like to add another label?</p>
          <button
            onClick={() => {
              toggleLabelAdded(false)
            }}
          >
            Add Another Label
          </button>
        </div>
      ) : (
        <div className="add-label-form-wrapper u-flow">
          <h1>Add New Label</h1>
          <form className="add-new-label-form u-flow" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="name">Label Name:</label>
              <input
                onChange={handleChange}
                name="name"
                type="text"
                placeholder="Enter Label Name"
                value={formValues.name}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="email">Label E-mail:</label>
              <input
                onChange={handleChange}
                name="email"
                type="email"
                value={formValues.email}
                required
              />
            </div>
            <button
              type="submit"
              className="btn primary"
              disabled={!formValues.name || !formValues.email}
            >
              Add Label
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

export default AddLabel
