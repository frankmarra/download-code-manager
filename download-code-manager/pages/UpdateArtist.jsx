import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { parseCookies } from '../helpers'
import Nav from '../components/navbar'

export async function getServerSideProps({ req }) {
  const cookieString = parseCookies(req)
  const cookies = JSON.parse(cookieString.user)
  let res
  cookies.user.labelId != null
    ? (res = await axios.get(
        `http://localhost:3001/api/labels/${cookies.user.labelId}/artists/`
      ))
    : (res = await axios.get(`http://localhost:3001/api/labels/0/artists/`))
  const artists = res.data

  return {
    props: { user: cookies, artists: artists }
  }
}
const UpdateArtist = ({ user, artists }) => {
  const [artist, setArtist] = useState()
  const [artistChoice, setArtistChoice] = useState('')
  const [formValues, setFormValues] = useState({
    name: artist ? artist.name : '',
    email: artist ? artist.email : '',
    url: artist ? artist.url : '',
    logo: artist ? artist.logo : '',
    redeemLink: artist ? artist.redeemLink : '',
    isActive: artist ? artist.isActive : ''
  })
  const router = useRouter()

  useEffect(() => {
    const getArtist = async () => {
      const res = await axios.get(
        `http://localhost:3001/api/labels/${user.user.labelId}/artists/${artistChoice}`
      )
      const selectedArtist = res.data
      setArtist(selectedArtist)
    }
    artistChoice ? getArtist() : setArtist('')
  }, [artistChoice])

  useEffect(() => {
    artist
      ? setFormValues({
          name: artist.name,
          email: artist.email,
          url: artist.url,
          logo: artist.logo,
          redeemLink: artist.redeemLink,
          isActive: artist.isActive
        })
      : setFormValues({
          name: '',
          email: '',
          url: '',
          logo: '',
          redeemLink: '',
          isActive: ''
        })
  }, [artist])

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleArtistChange = (e) => {
    setArtistChoice(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.put(
      `http://localhost:3001/api/labels/${artist.labelId}/artists/${artist.id}`,
      formValues
    )
    user.user.labelId == null
      ? router.push('/')
      : router.push(`/labels/${user.user.labelId}`)
  }

  return (
    <div className="update-artist-page">
      <Nav />
      {artists && (
        <div className="update-artist-form-wrapper">
          <h1>Update Artist</h1>
          <div className="input-wrapper">
            <label htmlFor="artist">Select Artist:</label>
            <select name="artist" onChange={handleArtistChange}>
              <option value="">--Please choose an artist--</option>
              {artists.map((artist, index) => (
                <option key={index} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
          <form className="update-artist-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="name">Name:</label>
              <input
                onChange={handleChange}
                name="name"
                type="text"
                value={formValues.name}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="email">E-mail:</label>
              <input
                onChange={handleChange}
                name="email"
                type="email"
                value={formValues.email}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="url">URL:</label>
              <input
                onChange={handleChange}
                name="url"
                type="text"
                value={formValues.url}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="logo">Logo:</label>
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
            <div className="input-wrapper">
              <label htmlFor="isActive">Status:</label>
              <select name="isActive" onChange={handleChange}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              className="update-artist-button"
              disabled={!formValues.name && !formValues.email}
            >
              Update Artist
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
}

export default UpdateArtist
