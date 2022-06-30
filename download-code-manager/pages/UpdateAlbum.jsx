import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
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

const UpdateAlbum = ({ user, artists }) => {
  const [artist, setArtist] = useState()
  const [album, setAlbum] = useState()
  const [artistChoice, setArtistChoice] = useState()
  const [albumChoice, setAlbumChoice] = useState()
  const [formValues, setFormValues] = useState({
    name: '',
    isActive: ''
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
    if (artistChoice) {
      getArtist()
    } else {
      setArtist('')
      setAlbumChoice('')
    }
  }, [artistChoice])

  useEffect(() => {
    const getAlbum = async () => {
      const res = await axios.get(
        `http://localhost:3001/api/labels/${user.user.labelId}/artists/${artistChoice}/albums/${albumChoice}`
      )
      const selectedAlbum = res.data
      setAlbum(selectedAlbum)
    }
    albumChoice ? getAlbum() : setAlbum('')
  }, [albumChoice])

  useEffect(() => {
    album
      ? setFormValues({
          name: album.name,
          isActive: album.isActive
        })
      : setFormValues({
          name: '',
          isActive: ''
        })
  }, [album])

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleArtistChange = (e) => {
    setArtistChoice(e.target.value)
  }

  const handleAlbumChange = (e) => {
    setAlbumChoice(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.put(
      `http://localhost:3001/api/labels/${artist.labelId}/artists/${artist.id}/albums/${album.id}`,
      formValues
    )
    user.user.labelId == null
      ? router.push('/')
      : router.push(`/labels/${user.user.labelId}`)
  }

  return (
    <div className="update-album-page">
      <Nav />
      {artists && (
        <div className="update-album-form-wrapper">
          <h1>Update Album</h1>
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
          <div className="input-wrapper">
            <label htmlFor="album">Select Album:</label>
            <select name="album" onChange={handleAlbumChange}>
              <option value="">--Please choose an album</option>
              {artist ? (
                artist.Albums.map((album, index) => (
                  <option key={index} value={album.id}>
                    {album.name}
                  </option>
                ))
              ) : (
                <option>--You must select an artist first--</option>
              )}
            </select>
          </div>
          <form className="update-album-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="name">Name:</label>
              <input
                onChange={handleFormChange}
                name="name"
                type="text"
                value={formValues.name}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="isActive">Status:</label>
              <select name="isActive" onChange={handleFormChange}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              className="update-album-button"
              disabled={!album && !formValues.name}
            >
              Update Album
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

export default UpdateAlbum
