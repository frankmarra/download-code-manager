//Add album page

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import { parseCookies } from '../helpers'
import Client from '../services/api'

//Get user cookie.
export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req)

  return {
    props: { user: JSON.parse(cookies.user) }
  }
}

const AddAlbum = ({ user }) => {
  const [cookies] = useCookies(['user'])
  const [formValues, setFormValues] = useState({
    name: '',
    artistId: ''
  })
  const router = useRouter()
  const [label, setLabel] = useState()
  const [albumAdded, toggleAlbumAdded] = useState(false)
  const [newAlbum, setNewAlbum] = useState()

  useEffect(() => {
    const getLabel = async () => {
      const res = await Client.get(`/labels/${user.userLabelSlug}`)
      const label = res.data
      setLabel(label)
    }
    getLabel()
  }, [])

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await Client.post(
      `/labels/${user.user.labelId}/artists/${formValues.artistId}`,
      formValues
    )
    setNewAlbum(res.data)
    setFormValues({ name: '', artistId: '' })
    toggleAlbumAdded(true)
  }

  return (
    <div className="form-container">
      {label ? (
        albumAdded ? (
          <div className="album-added-wrapper u-flow">
            <h1>New Album Added</h1>
            <p>A new album with the name {`${newAlbum.name}`} was added.</p>
            <p>Would you like to add another album?</p>
            <button
              className="btn primary"
              type="reset"
              onClick={() => {
                toggleAlbumAdded(false)
              }}
            >
              Add Another Album
            </button>
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
        ) : (
          <div className="add-album-form-wrapper u-flow">
            <h1>Add New Album</h1>
            <form className="add-new-album-form u-flow" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <label htmlFor="artistId">Artist:</label>
                <select id="artistId" onChange={handleChange}>
                  <option value="">--Please choose an artist--</option>
                  {label.Artists.map((artist, index) => (
                    <option key={index} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </div>
              {formValues.artist != '' ? (
                <div className="input-wrapper">
                  <label htmlFor="name">Album Name</label>
                  <input
                    onChange={handleChange}
                    id="name"
                    type="text"
                    placeholder="Enter Album Name"
                    value={formValues.name}
                    required
                  />
                </div>
              ) : (
                <div>Please select an artist to add an album to.</div>
              )}
              <button
                type="submit"
                className="btn primary"
                disabled={!formValues.name && !formValues.artistId}
              >
                Add Album
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
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default AddAlbum
