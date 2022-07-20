import { useState, useEffect } from 'react'
import axios from 'axios'
import Client from '../services/api'

const CodeGenerator = ({ artists, redeemLink, labelId }) => {
  const [activeArtists, setActiveArtists] = useState()
  const [activeAlbums, setActiveAlbums] = useState()
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
      setActiveArtists(artists)
    }
    getActiveArtists()
  }, [])

  useEffect(() => {
    const getActiveAlbums = async () => {
      let res = await Client.get(
        `/labels/${labelId}/artists/${
          activeArtists[formValues.artist].id
        }/active`
      )
      let albums = res.data
      setActiveAlbums(albums)
    }
    formValues.artist ? getActiveAlbums() : null
  }, [formValues.artist])

  useEffect(() => {
    const removeCode = async () => {
      if (randomCode) {
        let codeId = parseInt(randomCode.id)
        await Client.put(
          `/labels/${labelId}/artists/${artists[formValues.artist].id}/albums/${
            artists[formValues.artist].Albums[formValues.album].id
          }/codes/${codeId}`,
          { used: true }
        )
      }
    }
    removeCode(randomCode)
  }, [randomCode])
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await Client.get(
      `/labels/${labelId}/artists/${artists[formValues.artist].id}/albums/${
        artists[formValues.artist].Albums[formValues.album].id
      }/codes/unused`
    )
    let randomNumber = Math.floor(Math.random() * res.data.length)
    setRandomCode(res.data[randomNumber])
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
              <select name="artist" onChange={handleChange}>
                <option value="">--Please choose an artist--</option>
                {activeArtists.map((artist, index) => (
                  <option key={index} value={index}>
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
                <select name="album" onChange={handleChange}>
                  <option value="">--Please choose an album--</option>
                  {activeAlbums.map((album, index) => (
                    <option key={index} value={index}>
                      {album.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <h4>No Albums for this Artist</h4>
            ))}
          {formValues.album != '' ? (
            clicked ? (
              <h4>Your Code:</h4>
            ) : artists[formValues.artist].Albums[formValues.album].Codes
                .length > 0 ? (
              <button className="btn primary" type="submit">
                Generate Code
              </button>
            ) : (
              <h4>No Codes For This Album</h4>
            )
          ) : (
            <div></div>
          )}
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
              <a href={redeemLink} target="_blank">
                Redeem Here
              </a>
            </div>
          </div>
        ) : (
          <div>
            <h4>Please choose an artist and album to generate a code</h4>
          </div>
        )}
      </div>
    )
  )
}

export default CodeGenerator
