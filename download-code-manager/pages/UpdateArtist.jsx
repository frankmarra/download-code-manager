import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { parseCookies } from '../helpers'
import Client from '../services/api'

export async function getServerSideProps({ req }) {
  const cookieString = parseCookies(req)
  const cookies = JSON.parse(cookieString.user)
  let res = await Client.get(`/labels/${cookies.user.labelId}/artists/`)
  const artists = res.data

  return {
    props: { user: cookies, artists: artists }
  }
}
const UpdateArtist = ({ user, artists }) => {
  const [artist, setArtist] = useState()
  const [artistChoice, setArtistChoice] = useState('')
  const [formValues, setFormValues] = useState({
    email: '',
    url: '',
    logo: '',
    redeemLink: '',
    pagePassword: '',
    displayName: '',
    isActive: ''
  })
  const router = useRouter()

  useEffect(() => {
    const getArtist = async () => {
      const res = await Client.get(
        `/labels/${user.user.labelId}/artists/${artistChoice}`
      )
      const selectedArtist = res.data
      setArtist(selectedArtist)
    }
    artistChoice ? getArtist() : setArtist('')
  }, [artistChoice])

  useEffect(() => {
    artist
      ? setFormValues({
          email: artist.email,
          url: artist.url,
          logo: artist.logo,
          redeemLink: artist.redeemLink,
          pagePassword: artist.pagePassword,
          displayName: artist.displayName ? artist.displayName : artist.name,
          isActive: artist.isActive
        })
      : setFormValues({
          email: '',
          url: '',
          logo: '',
          redeemLink: '',
          pagePassword: '',
          displayName: '',
          isActive: ''
        })
  }, [artist])

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleArtistChange = (e) => {
    setArtistChoice(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await Client.put(
      `/labels/${artist.labelId}/artists/${artist.id}`,
      formValues
    )
    user.user.labelId == null
      ? router.push('/')
      : router.push(`/labels/${user.userLabelSlug}`)
  }

  return (
    <section className="form-container">
      {artists && (
        <div className="update-artist-form-wrapper u-flow">
          <h1>Update Artist</h1>
          <div className="input-wrapper">
            <label htmlFor="artist">Select Artist</label>
            <select name="artist" onChange={handleArtistChange}>
              <option value="">--Please choose an artist--</option>
              {artists.map((artist, index) => (
                <option key={index} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
          <form className="update-artist-form u-flow" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="name">
                Name (This does not effect the download code manager artist URL)
              </label>
              <input
                onChange={handleChange}
                id="name"
                type="text"
                value={formValues.displayName}
                required
              />
            </div>
            {/*<div className="input-wrapper">
              <label htmlFor="email">E-mail</label>
              <input
                onChange={handleChange}
                id="email"
                type="email"
                value={formValues.email}
                required
              />
              </div>*/}
            <div className="input-wrapper">
              <label htmlFor="url">URL</label>
              <input
                onChange={handleChange}
                id="url"
                type="text"
                value={formValues.url}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="logo">Logo</label>
              <input
                onChange={handleChange}
                id="logo"
                type="text"
                value={formValues.logo}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="pagePassword">
                Password to access code generator (Leave blank if you do not
                want to password protect your codes)
              </label>
              <input
                onChange={handleChange}
                id="pagePassword"
                type="text"
                value={formValues.pagePassword}
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="redeemLink">Redemption Link</label>
              <input
                onChange={handleChange}
                id="redeemLink"
                type="text"
                value={formValues.redeemLink}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="isActive">Status</label>
              <select id="isActive" onChange={handleChange}>
                <option value="">--Set Status--</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn primary"
              disabled={!formValues.name && !formValues.email}
            >
              Update Artist
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
      )}
    </section>
  )
}

export default UpdateArtist
