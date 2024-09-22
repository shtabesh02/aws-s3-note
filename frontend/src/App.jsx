import { useState } from 'react'
import {NavLink} from 'react-router-dom'
import axios from 'axios'
import './App.css'

function App() {
  const [photo, setPhoto] = useState(0);
  const photoname = 12;
  const [message, setMessage] = useState();
  const handleUploadingThePhoto = async (e)  => {
    e.preventDefault();
    const formDate = new FormData();
    formDate.append('photo', photo);

    await axios(`/api/photos/${photoname}`)
    .then((response) => setMessage(response))

  }
  return (
    <>
   
      <div className='photoframe'>
        <img src="" alt="Photo not found" />
      </div>
      <div>
        <form onSubmit={handleUploadingThePhoto}>
          <input type="file" accept='image/*' name='photo' onChange={e => setPhoto(e.target.files[0])} /> <br />
          <button>Upload a new photo</button>
        </form>
        <p>The uploaded message {message}</p>
        <button>Delete this photo</button>
      </div>
      {/* <NavLink to={`/api/photos/1`}>Get the details</NavLink> */}
    </>
  )
}

export default App
