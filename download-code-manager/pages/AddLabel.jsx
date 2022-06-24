import { useState } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const AddLabel = () => {
  const [cookies] = useCookies(['user'])
  const [formValues, setFormValues] = useState({
    name: '',
    email: ''
  })
  const [labelAdded, toggleLabelAdded] = useState(false)
  const [newLabel, setNewLabel] = useState()

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

  return labelAdded ? (
    <div className="add-label-page">
      <div className="label-added-wrapper">
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
    </div>
  ) : (
    <div className="add-label-page">
      <div className="add-label-form-wrapper">
        <h1>Add New Label</h1>
        <form className="add-new-label-form" onSubmit={handleSubmit}>
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
            className="add-label-button"
            disabled={!formValues.name || !formValues.email}
          >
            Add Label
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddLabel
