import { useState, useEffect } from 'react'
import axios from 'axios'
import Client from '../services/api'

const CodeGenerator = ({ artists, redeemLink, labelId, labelSlug }) => {
  const [activeArtists, setActiveArtists] = useState([
    { name: '--please choose an artist--', id: 0 }
  ])
  const [activeAlbums, setActiveAlbums] = useState()
  const [activeCodes, setActiveCodes] = useState()
  const [randomCode, setRandomCode] = useState()
  const [clicked, setClicked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formValues, setFormValues] = useState({
    artist: '',
    album: ''
  })

  useEffect(() => {
    const getActiveArtists = async () => {
      let res = await Client.get(`/labels/${labelId}/active`)
      let artists = res.data
      setActiveArtists([...activeArtists, ...artists])
    }
    getActiveArtists()
  }, [])

  useEffect(() => {
    const getActiveAlbums = async () => {
      let res = await Client.get(
        `/labels/${labelId}/artists/${formValues.artist}/active`
      )
      let albums = res.data
      setActiveAlbums(albums)
    }
    formValues.artist ? getActiveAlbums() : null
  }, [formValues.artist])

  useEffect(() => {
    const getActiveCodes = async () => {
      const res = await Client.get(
        `/labels/${labelId}/artists/${formValues.artist}/albums/${formValues.album}/codes/unused`
      )
      let codes = res.data
      setActiveCodes(codes)
    }
    formValues.album ? getActiveCodes() : null
  }, [formValues.album])

  useEffect(() => {
    const removeCode = async () => {
      if (randomCode) {
        let codeId = parseInt(randomCode.id)
        await Client.put(
          `/labels/${labelId}/artists/${formValues.artist}/albums/${formValues.album}/codes/${codeId}`,
          { used: true }
        )
      }
    }
    removeCode(randomCode)
  }, [randomCode])

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // const res = await Client.get(
    //   `/labels/${labelId}/artists/${formValues.artist}/albums/${formValues.album}/codes/unused`
    // )
    let randomNumber = Math.floor(Math.random() * activeCodes.length)
    setRandomCode(activeCodes[randomNumber])
    setClicked(true)
  }

  const copyToClipboard = async (code) => {
    if ('clipboard' in navigator) {
      setCopied(true)
      return await navigator.clipboard.writeText(code)
    } else {
      setCopied(true)
      return document.execCommand('copy', true, code)
    }
  }

  const reset = () => {
    document.getElementById('artist-album-select').reset()
    setFormValues({
      artist: '',
      album: ''
    })
    setClicked(false)
    setCopied(false)
    setRandomCode()
  }

  return (
    activeArtists && (
      <div className="artist-album-select-wrapper">
        <form
          className="artist-album-select-form u-flow"
          id="artist-album-select"
          onSubmit={handleSubmit}
        >
          {activeArtists.length > 0 ? (
            <div className="input-wrapper">
              <label htmlFor="artist">Artist</label>
              <select id="artist" onChange={handleChange}>
                {activeArtists.map((artist, index) => (
                  <option key={index} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <h4>No Artists Available</h4>
          )}
          {formValues.artist != '' &&
            activeAlbums &&
            (activeAlbums.length > 0 ? (
              <div className="input-wrapper">
                <label htmlFor="album">Album</label>
                <select id="album" onChange={handleChange}>
                  <option value="">--Please choose an album--</option>
                  {activeAlbums.map((album, index) => (
                    <option key={index} value={album.id}>
                      {album.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <h4>No Albums for this Artist</h4>
            ))}
          {formValues.album != '' && activeCodes ? (
            clicked ? (
              <h4>Your Code:</h4>
            ) : activeCodes.length > 0 ? (
              <button className="btn primary" type="submit">
                Generate Code
              </button>
            ) : (
              <h4>No Codes For This Album</h4>
            )
          ) : null}
        </form>
        {randomCode ? (
          <div className="random-code-wrapper u-flow">
            <div className="random-code u-flow">
              <h4>{randomCode.albumCode}</h4>
              {copied ? (
                <button className="btn copied" disabled>
                  Code Copied
                </button>
              ) : (
                <button
                  className="btn primary"
                  onClick={() => copyToClipboard(randomCode.albumCode)}
                >
                  Copy to Clipboard
                </button>
              )}
            </div>

            <div className="btn primary">
              <a href={`https://${redeemLink}`} target="_blank">
                Redeem Here
              </a>
            </div>

            <div className="btn primary">
              <button onClick={() => reset()}>Get Another Code</button>
            </div>
          </div>
        ) : null}
      </div>
    )
  )
}

export default CodeGenerator
