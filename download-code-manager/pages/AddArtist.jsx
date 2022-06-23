import { useState } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const AddArtist = () => {
  const [cookies] = useCookies(['user'])
  const [formValues, setFormValues] = useState({
    name: '',
    url: ''
  })
  const [artistAdded, setArtistAdded] = useState(false)
  const [newArtist, setNewArtist] = useState()
  const router = useRouter()

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post(
      `http://localhost:3001/api/labels/${cookies.userId.id}`,
      formValues
    )
    setNewArtist(res.data)
    setFormValues({ name: '', url: '' })
    setArtistAdded(true)
  }

  return artistAdded ? (
    <div className="add-artist-page">
      <div className="artist-added-wrapper">
        <h1>New Artist Added</h1>
        <p>A new artist was added with the name {`${newArtist.name}`}</p>
        <p>Would you like to add another artist?</p>
        <button
          onClick={() => {
            setArtistAdded(false)
          }}
        >
          Add Another Artist
        </button>
        <button
          onClick={() => {
            router.push(`/labels/${cookies.userId.id}`)
          }}
        >
          Home
        </button>
      </div>
    </div>
  ) : (
    <div className="add-artist-page">
      <div className="add-artist-form-wrapper">
        <h1>Add New Artist</h1>
        <form className="add-new-artist-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="name">Name:</label>
            <input
              onChange={handleChange}
              name="name"
              type="text"
              placeholder="Enter Artist Name"
              value={formValues.name}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="url">Arist Url</label>
            <input
              onChange={handleChange}
              name="url"
              type="text"
              value={formValues.url}
            />
          </div>
          <button
            type="submit"
            className="add-artist-button"
            disabled={!formValues.name}
          >
            Add Artist
          </button>
          <button
            onClick={() => {
              router.push(`/labels/${cookies.userId.id}`)
            }}
          >
            Home
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddArtist
