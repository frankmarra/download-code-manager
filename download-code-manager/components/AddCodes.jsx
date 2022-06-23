import { useState } from 'react'
import axios from 'axios'

const AddCodes = ({ artists }) => {
  const [codes, setCodes] = useState([])
  const [codesAdded, setCodesAdded] = useState(false)
  const [formValues, setFormValues] = useState({
    artist: '',
    album: '',
    albumCodes: ''
  })

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let codeArray = []
    let newCodes = formValues.albumCodes.split(/\s/g)
    newCodes.forEach((code) => {
      let newCode = {
        albumId: formValues.album,
        albumCode: code,
        used: false
      }
      codeArray.push(newCode)
    })
    setCodes(codeArray)
    await axios.post(
      `http://localhost:3001/api/labels/1/artists/${formValues.artist}/albums/${formValues.album}/create-codes`,
      codes
    )
    setCodesAdded(true)
  }

  const addMoreCodes = () => {
    setFormValues({
      artist: '',
      album: '',
      albumCodes: ''
    })
    setCodesAdded(false)
  }

  return codesAdded ? (
    <div>
      <h2>Codes Added!</h2>
      <button type="submit" onClick={addMoreCodes}>
        Add more codes?
      </button>
    </div>
  ) : (
    <div className="add-codes-wrapper">
      <form className="add-codes-form" id="add-codes" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="artist">Artist</label>
          <select name="artist" onChange={handleChange}>
            <option value="">--Please choose an artist--</option>
            {artists.map((artist) => (
              <option value={artist.id}>{artist.name}</option>
            ))}
          </select>
        </div>
        {formValues.artist != '' ? (
          <div className="input-wrapper">
            <label htmlFor="album">Album</label>
            <select name="album" onChange={handleChange}>
              <option value="">--Please choose an album--</option>
              {artists[formValues.artist - 1].Albums.map((album) => (
                <option value={album.id}>{album.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div></div>
        )}
        {formValues.album != '' ? (
          <div className="input-wrapper">
            <label htmlFor="albumCodes">Codes</label>
            <textarea
              name="albumCodes"
              placeholder="Enter your codes separated by a space"
              cols="50"
              rows="8"
              onChange={handleChange}
            ></textarea>
          </div>
        ) : (
          <div></div>
        )}
        {formValues.albumCodes != '' ? (
          <button type="submit">Add Codes!</button>
        ) : (
          <div></div>
        )}
      </form>
    </div>
  )
}

export default AddCodes
