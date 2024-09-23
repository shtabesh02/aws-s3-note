import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [photo, setPhoto] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [profile, setProfile] = useState(null);

  // const photoname = 12;
  const handleUploadingThePhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo-url', photo);

    await axios.post(`/api/photos/${photo}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(async (response) => {
        const result = await axios.get(`/api/photos/${response.data['url']}`);
        const result2 = Object.values(result)[0][0]['imageUrl'];
        setUploadedPhoto(result2);
      })

  }
  useEffect(() => {
     const getPhotos = async () => {
      try {
        const photos = await axios.get('/api/photos');
        console.log('profile photo: ', photos);
        setProfile(photos.data)
      } catch (error) {
        console.error('Error fetching photos: ', error)
      }
    }
    getPhotos();
  }, []);

  return (
    <>

      <div className='photoframe'>
        {
        uploadedPhoto ? <img src={uploadedPhoto} alt="Photo not found" />:
        <img src={profile} alt="Photo not found" />
        }
        
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
