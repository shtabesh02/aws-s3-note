import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [photo, setPhoto] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState();
  // const photoname = 12;
  const handleUploadingThePhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo-url', photo);

    await axios.post(`/api/photos/${photo}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(response => {
        console.log('response: ', response.data['url'])
        setUploadedPhoto(response.data['url'])
      })

  }
  return (
    <>

      <div className='photoframe'>
        <img src={uploadedPhoto} alt="Photo not found" />
      </div>
      <div>
        <form onSubmit={handleUploadingThePhoto}>
          <input type="file" accept='image/*' name='photo-url' onChange={e => setPhoto(e.target.files[0])} /> <br />
          <button>Upload a new photo</button>
        </form>
        <button>Delete this photo</button>
      </div>
      {/* <NavLink to={`/api/photos/1`}>Get the details</NavLink> */}
    </>
  )
}

export default App
