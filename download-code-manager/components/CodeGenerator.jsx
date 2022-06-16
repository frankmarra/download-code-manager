import { useState } from 'react'
import axios from 'axios'

const CodeGenerator = ({ artists }) => {
  const [randomCode, setRandomCode] = useState({})
  const [formValues, setFormValues] = useState({
    artist: '',
    album: ''
  })

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.get(
      `http://localhost:3001/api/labels/1/artists/${formValues.artist}/albums/${formValues.album}/codes/unused`
    )
    let randomNumber = Math.floor(Math.random() * res.data.length)
    setRandomCode(res.data[randomNumber])
  }

  return (
    <div className="artist-album-select-wrapper">
      <form
        className="artist-album-select-form"
        id="artist-album-select"
        onSubmit={handleSubmit}
      >
        <div className="input-wrapper">
          <label htmlFor="artist">Artist</label>
          <select name="artist" onChange={handleChange}>
            <option value="">--Please choose an artist--</option>
            {artists.map((artist) => (
              <option value={artist.id}>{artist.artistName}</option>
            ))}
          </select>
        </div>
        {formValues.artist != '' ? (
          <div className="input-wrapper">
            <label htmlFor="album">Album</label>
            <select name="album" onChange={handleChange}>
              <option value="">--Please choose and album--</option>
              {artists[formValues.artist - 1].Albums.map((album) => (
                <option value={album.id}>{album.albumName}</option>
              ))}
            </select>
          </div>
        ) : (
          <div></div>
        )}
        {formValues.album != '' ? (
          <button type="submit">Get Code!</button>
        ) : (
          <div></div>
        )}
      </form>
      {randomCode != {} ? (
        <div className="random-code">{randomCode.albumCode}</div>
      ) : (
        <div>Please choose and artist and album to generate a code</div>
      )}
    </div>
  )
}

export default CodeGenerator
