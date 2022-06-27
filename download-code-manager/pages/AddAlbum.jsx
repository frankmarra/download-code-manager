import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import axios from 'axios'

// export async function getServerSideProps(context) {
//   const cookies = context.req.cookies['user']

//   return {
//     props: {
//       user: cookies.user
//     }
//   }
// }

const AddAlbum = () => {
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
      const res = await axios.get(
        `http://localhost:3001/api/labels/${cookies.user.user.labelId}`
      )
      const label = res.data
      setLabel(label)
      console.log('label', label)
    }
    getLabel()
  }, [])

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post(
      `http://localhost:3001/api/labels/${cookies.user.user.labelId}/artists/${formValues.artistId}`,
      formValues
    )
    setNewAlbum(res.data)
    setFormValues({ name: '' })
    toggleAlbumAdded(true)
  }

  return label ? (
    albumAdded ? (
      <div className="add-album-page">
        <div className="album-added-wrapper">
          <h1>New Album Added</h1>
          <p>A new album with the name {`${newAlbum.name}`} was added.</p>
          <p>Would you like to add another album?</p>
          <button
            onClick={() => {
              toggleAlbumAdded(false)
            }}
          >
            Add Another Album
          </button>
          <button
            onClick={() => {
              router.push(`/labels/${cookies.user.user.labelId}`)
            }}
          >
            Home
          </button>
        </div>
      </div>
    ) : (
      <div className="add-album-page">
        <div className="add-album-form-wrapper">
          <h1>Add New Album</h1>
          <form className="add-new-album-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="artistId">Artist:</label>
              <select name="artistId" onChange={handleChange}>
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
                  name="name"
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
              className="add-album-button"
              disabled={!formValues.name && !formValues.artistId}
            >
              Add Album
            </button>
          </form>
          <button
            onClick={() => {
              router.push(`/labels/${cookies.user.user.labelId}`)
            }}
          >
            Home
          </button>
        </div>
      </div>
    )
  ) : (
    <div>Loading...</div>
  )
}

export default AddAlbum
