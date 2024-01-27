import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import './navigation.css'
import Profile from '../profilephoto/Profile'

function Navigation({ profile, ws, searchicon , disable,setdisable}) {
  const [profilesrc, setprofilesrc] = useState()
  // const profilesrc = JSON.parse(localStorage.getItem('image'))

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('image'))
    if (profile === undefined) {
      setprofilesrc('No image')
    } else {
      setprofilesrc(profile)
    }
  }, [])

  const closewebsocketconnection = () => {
    if (searchicon === true) {
      if (disable && ws.current.readyState !== WebSocket.CLOSED) {
        ws.current.close()
        console.log("websocket connection is closed")
        setdisable(false)
      }
    }
  }

  return (
    <nav className='navigation'>
      {
        !profile ? (
          <>
            <NavLink to={`/profile`} style={{ "cursor": "pointer" }} onClick={() => { closewebsocketconnection() }}>
              <Profile profilesrc={profilesrc} />
            </NavLink>
            <div className='nav_links'>
              <ul>
                <li ><NavLink to="/chats" activeclass="active">Chats</NavLink></li>
                {/* <li ><NavLink to="/groups" activeclass="active">Groups</NavLink></li> */}
              </ul>
            </div>
          </>
        ) : (
          <div className='profile'>
            <NavLink to="/chats">
              <FontAwesomeIcon icon={faArrowLeft} color='black' />
            </NavLink>
            <p>Profile</p>
          </div>
        )
      }
    </nav >
  )
}

export default Navigation
