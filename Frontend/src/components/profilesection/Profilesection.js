import React, { useEffect, useRef, useState } from 'react'
import './profilesection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faFileImage, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Profilesection() {
  const imgref = useRef()
  const inputref = useRef()
  const [imgsrc, setimgsrc] = useState()
  const [username, setUsername] = useState('')
  const [useremail, setuseremail] = useState('')
  // const [mobilenumber, setmobilenumber] = useState('')
  const token = JSON.parse(localStorage.getItem("token"))
  const userdata = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const getimg = async () => {
    await axios({
      method: "get",
      url: "http://127.0.0.1:8000/account/api/user/profile",
      headers: {
        Authorization: `Bearer ${token.access}`,
        'Content-Type': 'multipart/form-data',
      }
    })
      .then((Response) => {
        console.log(Response)
        if (Response.data !== "") {
          localStorage.setItem('image', JSON.stringify(Response.data[0].profile_img))
          console.log(Response)
          setimgsrc(Response.data[0].profile_img)
        } else {
          localStorage.setItem('image', JSON.stringify("No image"))
        }
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  useEffect(() => {
    console.log("profile section")
    setUsername(userdata.name)
    setuseremail(userdata.email)
    // setmobilenumber(userdata?.contact)
    getimg()
    // eslint-disable-next-line
  }, [])

  const postimgsrc = async (img, filename) => {
    try {
      const formData = new FormData();
      formData.append('user', userdata.id);
      formData.append('profile_image', img);
      formData.append('filename', filename)
      const response = await axios.post('http://127.0.0.1:8000/account/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('conform', response);
    } catch (error) {
      console.error('error', error);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    var reader = new FileReader();
    reader.onload = function (e) {
      setimgsrc(e.target.result)
      console.log(e.target.result)
      localStorage.setItem('image', JSON.stringify(e.target.result))
    };
    reader.readAsDataURL(file)
    postimgsrc(file, file.name)
  }

  const deleteprofile = async () => {
    await axios({
      method: 'delete',
      url: 'http://127.0.0.1:8000/account/api/user/profile',
      headers: {
        Authorization: `Bearer ${token.access}`,
        'Content-Type': 'multipart/form-data',
      },
      data: ({
        user: userdata.id
      })
    })
      .then((response) => {
        console.log("sucess ", response)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  const handleremoveimage = () => {
    deleteprofile()
    inputref.current.value = ""
    setimgsrc(null)
  }

  const updateusername = async () => {
    await axios({
      method: "put",
      url: "http://127.0.0.1:8000/account/api/user/UpdateUserInfo",
      headers: {
        Authorization: `Bearer ${token.access}`,
        'Content-Type': 'multipart/form-data',
      },
      data: {
        name: username
      }
    })
      .then((response) => {
        console.log("sucess ", response)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  // const updatemobilenumber = async () => {
  //   await axios({
  //     method: "put",
  //     // url: "http://127.0.0.1:8000/account/api/user/UpdateUserInfo",
  //     headers: {
  //       Authorization: `Bearer ${token.access}`,
  //       'Content-Type': 'multipart/form-data',
  //     },
  //     data: {
  //       contact: mobilenumber
  //     }
  //   })
  //     .then((response) => {
  //       console.log("sucess ", response)
  //     })
  //     .catch((error) => {
  //       console.log('error', error)
  //     })
  // }

  const handleupdateusername = () => {
    updateusername()
  }

  const handlelogout = () => {
    localStorage.clear()
    navigate('/Auth')
  }

  return (
    <div className='profilesection'>
      <div className="userimg">
        <div className="img" ref={imgref} style={{ backgroundImage: imgsrc !== null ? `url(${imgsrc})` : null }}>
          {imgsrc == null ? (
            <>
              <div style={{
                "width": "100%",
                "height": "100%",
                "borderRadius": "50%",
                "display": "flex",
                "alignItems": "center",
                "justifyContent": "center",
                "backgroundColor": "#aebac1"
              }}>
                <FontAwesomeIcon icon={faUser} color='#75777a' size='3x' />
              </div>
            </>
          ) : null}
        </div>
        <div className="setimg">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <input
              ref={inputref}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleImageChange(e)}
              style={{ opacity: 0, position: 'absolute', top: 0, left: 0 }}
            />
            <FontAwesomeIcon icon={faFileImage} color='black' />
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }} onClick={() => handleremoveimage()}>
            <FontAwesomeIcon icon={faTrashCan} color='black' />
          </div>
        </div>
      </div>
      <div className="name">
        <input
          type="text"
          placeholder='Enter your name'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => handleupdateusername()}>Save</button>
      </div>
      {/* <div className="name">
        <input
          type="text"
          placeholder='Enter your Mobile Number'
          value={mobilenumber}
          onChange={(e) => setmobilenumber(e.target.value)}
        />
        <button onClick={() => updatemobilenumber()}>Save</button>
      </div> */}  	
      <div>
        <b>Email</b> - {useremail}
      </div>

      <div className="logout">
        <button style={{ "--v": "#00DC92", "--h": '#0DF054' }} onClick={() => { handlelogout() }}>Logout</button>
      </div>
    </div>
  )
}

export default Profilesection
