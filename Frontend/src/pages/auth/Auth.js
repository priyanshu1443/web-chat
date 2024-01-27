import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/backgroundimage/WeBCHaT.png'

import './auth.css'

function Auth() {
  const [form, setform] = useState(true)
  const [Username, setUsername] = useState('')
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const [Cpassword, setCpassword] = useState('')
  const navigate = useNavigate()
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);


  const getimg = async (token) => {
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
          console.log(Response.data)
          localStorage.setItem('image', JSON.stringify(Response.data.profile_img))
        }
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener('resize', updateScreenWidth);

    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios({
      method: "post",
      url: `http://127.0.0.1:8000/account/api/user/${form ? "login" : "register"}`,
      headers: {},
      data: form ? ({
        email: Email,
        password: Password
      }) : ({
        email: Email,
        name: Username,
        password: Password,
        password2: Cpassword,
        tc: true
      })
    }).then((response) => {
      console.log(response.data)
      if (form) {
        localStorage.setItem("token", JSON.stringify(response.data.token))
        localStorage.setItem("user", JSON.stringify(response.data.data))
        getimg(response.data.token)         
          !response.data.first_time ? navigate('/profile') : navigate("/chats")
        // navigate("/chats")
      }
      if (response.data.msg === "Registration Successful") {
        
        setform(!form)
      }
    }).catch((error) => {
      console.log(error)
    })
    setUsername('')
    setEmail('')
    setPassword('')
    setCpassword("")
  }


  return (
    <div className="auth_page">
      <div className="form_body" style={{ display: screenWidth <= 768 ? "none" : "block" }}>
        <img src={logo} alt="" />
      </div>
      <div className="form_body" >
        <h1>{form ? "login" : "Registration"}</h1>
        <form onSubmit={handleSubmit}>
          {
            form ? null : (
              <label htmlFor="username">
                <p>Name :</p>
                <input
                  type="text"
                  name="username"
                  id='username'
                  autoComplete='off'
                  placeholder='Enter Username'
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            )
          }
          <label htmlFor="email">
            <p>Email :</p>
            <input
              type="email"
              name="email"
              id='email'
              autoComplete='off'
              placeholder='abc@example.com '
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            <p>Password :</p>
            <input
              type="password"
              id='password'
              name="password"
              placeholder='Enter password'
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {
            form ? null : (
              <label htmlFor="cpassword">
                <p>Password :</p>
                <input
                  type="password"
                  name="cpassword"
                  id='cpassword'
                  placeholder='Conform password'
                  value={Cpassword}
                  onChange={(e) => setCpassword(e.target.value)}
                />
              </label>
            )
          }
          <input type="submit" value={form ? "Login" : "Register"} />
        </form>
        <p onClick={() => setform(!form)}>{form ? "I don't have an account" : "I have an account"}</p>
      </div>
    </div>
  )
}

export default Auth
