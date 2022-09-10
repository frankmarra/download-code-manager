import { useState, useEffect } from 'react'
import axios from 'axios'
import Client from '../services/api'

const CodeGenerator = ({
  artists,
  redeemLink,
  labelId,
  labelSlug,
  pagePassword
}) => {
  const [activeArtists, setActiveArtists] = useState({
    name: '--Choose Artist--',
    id: 0
  })
  const [activeAlbums, setActiveAlbums] = useState()
  const [activeCodes, setActiveCodes] = useState()
  const [randomCode, setRandomCode] = useState()
  const [clicked, setClicked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formValues, setFormValues] = useState({
    artist: '',
    album: ''
  })

  artists.sort((a, b) => {
    const artistA = a.name.toUpperCase()
    const artistB = b.name.toUpperCase()
    if (artistA < artistB) {
      return -1
    }
    if (artistA > artistB) {
      return 1
    }
  })

  // useEffect(() => {
  //   const getActiveArtists = async () => {
  //     let res = await Client.get(`/labels/${labelId}/active`)
  //     let artists = res.data

  //     setActiveArtists([{ name: '--Choose Artist--', id: 0 }, ...artists])
  //   }
  //   getActiveArtists()
  // }, [])

  useEffect(() => {
    const getActiveAlbums = async () => {
      let res = await Client.get(
        `/labels/${labelId}/artists/${formValues.artist}/active`
      )
      let albums = res.data

      setActiveAlbums([{ name: '--Choose Album--', id: 0 }, ...albums])
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

  const handleArtistChange = (e) => {
    setFormValues({ album: '0', [e.target.id]: e.target.value })
  }

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    setFormValues({
      artist: '',
      album: ''
    })
    setClicked(false)
    setCopied(false)
    setRandomCode()
    // document.getElementById('artist-album-select').reset()
  }

  return (
    artists && (
      <div className="artist-album-select-wrapper">
        {!clicked ? (
          <>
            <h3 style={{ textAlign: 'center' }}>Generate Album Code:</h3>
            <form
              className="artist-album-select-form u-flow"
              id="artist-album-select"
              name="artist-album-select"
              onSubmit={handleSubmit}
            >
              {artists.length > 0 ? (
                <div className="input-wrapper">
                  <label htmlFor="artist">Artist</label>
                  <select
                    id="artist"
                    onChange={handleArtistChange}
                    value={formValues.artist}
                    defaultValue="--Choose Artist--"
                  >
                    <option selected value="">
                      --Choose Artist--
                    </option>
                    {artists.map((artist, index) =>
                      artist.isActive ? (
                        <option key={index} value={artist.id}>
                          {artist.name}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>
              ) : (
                <h4>No Artists Available</h4>
              )}
              {formValues.artist != '' &&
                activeAlbums &&
                (activeAlbums.length > 1 ? (
                  <div className="input-wrapper">
                    <label htmlFor="album">Album</label>
                    <select
                      id="album"
                      onChange={handleChange}
                      value={formValues.album}
                    >
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
              {formValues.album != '' &&
              formValues.album != '0' &&
              activeCodes ? (
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
          </>
        ) : null}
        {randomCode ? (
          <div className="random-code-wrapper u-flow">
            <div className="random-code u-flow">
              <h4 style={{ color: 'black' }}>Your code:</h4>
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

            <button
              className="btn primary"
              onClick={() => reset()}
              style={{ width: '100%' }}
            >
              Get Another Code
            </button>
          </div>
        ) : null}
      </div>
    )
  )
}

export default CodeGenerator
