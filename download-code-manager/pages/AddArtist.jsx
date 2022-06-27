import { useState } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import Nav from '../components/navbar'

// export async function getServerSideProps(context) {
//   const cookies = context.req.cookies['user']

//   return {
//     props: { user: cookies.user }
//   }
// }

const AddArtist = () => {
  const [cookies] = useCookies(['user'])
  const [formValues, setFormValues] = useState({
    name: '',
    url: ''
  })
  const [artistAdded, toggleArtistAdded] = useState(false)
  const [newArtist, setNewArtist] = useState()
  const router = useRouter()

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post(
      `http://localhost:3001/api/labels/${cookies.user.user.labelId}`,
      formValues
    )
    setNewArtist(res.data)
    setFormValues({ name: '', url: '' })
    toggleArtistAdded(true)
  }

  return (
    <div className="add-artist-page">
      <Nav />
      {artistAdded ? (
        <div className="artist-added-wrapper">
          <h1>New Artist Added</h1>
          <p>A new artist was added with the name {`${newArtist.name}`}</p>
          <p>Would you like to add another artist?</p>
          <button
            onClick={() => {
              toggleArtistAdded(false)
            }}
          >
            Add Another Artist
          </button>
          <button
            onClick={() => {
              router.push(`/labels/${cookies.user.user.labelId}`)
            }}
          >
            Home
          </button>
        </div>
      ) : (
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
              <label htmlFor="url">Artist Url</label>
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
          </form>
          <button
            onClick={() => {
              router.push(`/labels/${cookies.user.user.labelId}`)
            }}
          >
            Home
          </button>
        </div>
      )}
    </div>
  )
}

export default AddArtist
