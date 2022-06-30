import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import Nav from '../components/navbar'
import { parseCookies } from '../helpers'

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req)

  return {
    props: { user: JSON.parse(cookies.user) }
  }
}

const AddArtist = ({ user }) => {
  const [cookies] = useCookies(['user'])
  const [labels, setLabels] = useState()
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    url: '',
    logo: '',
    redeemLink: '',
    labelId: user.user.labelId
  })
  const [artistAdded, toggleArtistAdded] = useState(false)
  const [newArtist, setNewArtist] = useState()
  const router = useRouter()

  useEffect(() => {
    const getLabels = async () => {
      const res = await axios.get(`http://localhost:3001/api/labels`)
      const labels = res.data
      setLabels(labels)
    }
    getLabels()
  }, [])
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post(
      `http://localhost:3001/api/labels/${formValues.labelId}`,
      formValues
    )
    setNewArtist(res.data)
    setFormValues({ name: '', url: '' })
    toggleArtistAdded(true)
  }

  return (
    labels && (
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
                user.user.labelId == null
                  ? router.push('/')
                  : router.push(`/labels/${user.user.labelId}`)
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
                <label htmlFor="email">Artist E-mail:</label>
                <input
                  onChange={handleChange}
                  name="email"
                  type="email"
                  value={formValues.email}
                />
              </div>
              <div className="input-wrapper">
                <label htmlFor="url">Artist Url:</label>
                <input
                  onChange={handleChange}
                  name="url"
                  type="text"
                  value={formValues.url}
                />
              </div>
              <div className="input-wrapper">
                <label htmlFor="logo">Artist Logo:</label>
                <input
                  onChange={handleChange}
                  name="logo"
                  type="text"
                  value={formValues.logo}
                />
              </div>
              <div className="input-wrapper">
                <label htmlFor="redeemLink">Redemption Link:</label>
                <input
                  onChange={handleChange}
                  name="redeemLink"
                  type="text"
                  value={formValues.redeemLink}
                />
              </div>
              {user.user.isAdmin ? (
                <div className="input-wrapper">
                  <label htmlFor="labelId">Artist Label:</label>
                  <select name="labelId" onChange={handleChange}>
                    <option value={null}>--Please choose a label--</option>
                    {labels.map((label, index) => (
                      <option key={index} value={label.id}>
                        {label.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div></div>
              )}
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
                user.user.labelId == null
                  ? router.push('/')
                  : router.push(`/labels/${user.user.labelId}`)
              }}
            >
              Home
            </button>
          </div>
        )}
      </div>
    )
  )
}

export default AddArtist
