import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import Client from '../services/api'

const AddCodes = ({ artists }) => {
  const [cookies] = useCookies(['user'])
  const [codes, setCodes] = useState([])
  const [codesAdded, setCodesAdded] = useState(false)
  const [codeTotals, setCodeTotals] = useState({
    unusedTotal: 0,
    usedTotal: 0
  })
  const [formValues, setFormValues] = useState({
    artist: '',
    album: '',
    albumCodes: ''
  })
  useEffect(() => {
    const getCodeTotals = async () => {
      if (formValues.album) {
        const res = await Client.get(
          `/labels/${cookies.user.user.labelId}/artists/${
            artists[formValues.artist].id
          }/albums/${formValues.album}/codes`
        )
        const totals = res.data
        setCodeTotals(totals)
      }
    }

    getCodeTotals()
  }, [formValues.album])

  useEffect(() => {
    const createCodeArray = async () => {
      let codeArray = []
      let newCodes = formValues.albumCodes.split(/\s/g)
      newCodes.forEach((code) => {
        let newCode = {
          albumId: formValues.album,
          albumCode: code,
          used: false,
          artistId: artists[formValues.artist].id
        }
        codeArray.push(newCode)
      })
      setCodes(codeArray)
    }
    formValues.albumCodes ? createCodeArray() : null
  }, [formValues.albumCodes])

  const handleArtistChange = (e) => {
    setFormValues({
      album: '',
      albumCodes: '',
      [e.target.id]: e.target.value
    })
  }

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await Client.post(
      `/labels/${cookies.user.user.labelId}/artists/${
        artists[formValues.artist].id
      }/albums/${formValues.album}/create-codes`,
      codes
      // {
      //   headers: {
      //     authorization: `Bearer ${cookies.user.token}`
      //   }
      // }
    )
    setCodesAdded(true)
    setTimeout(addMoreCodes, 5000)
  }

  const addMoreCodes = () => {
    setFormValues({
      artist: '',
      album: '',
      albumCodes: ''
    })
    setCodesAdded(false)
  }
  // <button className="btn primary" type="submit" onClick={addMoreCodes}>
  //   Add more codes?
  // </button>

  return codesAdded ? (
    <div>
      <h2>Codes Added!</h2>
    </div>
  ) : (
    <div className="form-container u-flow">
      <h2>Add Codes</h2>
      <form
        className="add-codes-form u-flow"
        id="add-codes"
        onSubmit={handleSubmit}
      >
        <div className="input-wrapper">
          <label htmlFor="artist">Artist</label>
          <select
            id="artist"
            onChange={handleArtistChange}
            defaultValue="--Choose Artist--"
          >
            <option selected value="">
              --Choose Artist--
            </option>
            {artists
              ? artists.map((artist, index) => (
                  <option key={index} value={index}>
                    {artist.name}
                  </option>
                ))
              : null}
          </select>
        </div>
        {formValues.artist && artists[formValues.artist].Albums.length > 0 ? (
          <div className="input-wrapper">
            <label htmlFor="album">Album</label>
            <select id="album" onChange={handleChange} value={formValues.album}>
              <option value="">--Choose Album--</option>
              {artists[formValues.artist].Albums.map((album, index) => (
                <option key={index} value={album.id}>
                  {album.name}
                </option>
              ))}
            </select>
          </div>
        ) : formValues.artist ? (
          <div>This artist has no albums</div>
        ) : null}
        {formValues.album ? (
          <div className="input-wrapper">
            <div className="code-totals">
              <div className="unused-codes">
                <h5>Codes Remaining: </h5>
                <p>{codeTotals.unusedTotal}</p>
              </div>
              <div className="used-codes">
                <h5>Codes Redeemed: </h5>
                <p>{codeTotals.usedTotal}</p>
              </div>
            </div>
            <label htmlFor="albumCodes">Codes</label>
            <textarea
              id="albumCodes"
              placeholder="Enter your codes separated by a space"
              cols="30"
              rows="8"
              onChange={handleChange}
            ></textarea>
          </div>
        ) : null}
        {formValues.albumCodes != '' ? (
          <button className="btn primary" type="submit">
            Add Codes!
          </button>
        ) : null}
      </form>
    </div>
  )
}

export default AddCodes
