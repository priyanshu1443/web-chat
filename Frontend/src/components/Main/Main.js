import React, { useState, useRef, useEffect } from 'react'

import './main.css'
import Navigation from '../navigation/Navigation'
import Connected from '../connected/Connected'
import Message from '../message/Message'
import Profilesection from '../profilesection/Profilesection'
import logo from '../../assets/backgroundimage/WeBCHaT.png'

function Main({
  connectedData,
  friends,
  profile,
  getusers,
  getfriends,
  setfriends,
  usersprofilephoto
}) {

  const [searchdata, setsearchdata] = useState([])
  const [searchicon, setsearchicon] = useState(true)
  const [disable, setdisable] = useState(false)
  const ws = useRef(null)
  const section1ref = useRef()
  const section2ref = useRef()
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);



  useEffect(() => {
    // console.log(window.location.href)
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener('resize', updateScreenWidth);

    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);

  const smallscreen = (msg) => {
    if (screenWidth <= 550) {
      section1ref.current.style.display = msg === 'tomsg' ? "none" : "block"
      section2ref.current.style.display = msg === 'tomsg' ? "block" : "none"
    }
  }


  return (
    <div className='main'>
      <div
        ref={section1ref}
        className="section-1"
        style={{
          width: screenWidth <= 550 ? "100vw" : screenWidth <= 768 ? "300px" : "400px"
        }}
      >
        <Navigation
          profile={profile}
          ws={ws}
          searchicon={searchicon}
          disable={disable}
          setdisable={setdisable}
        />
        {
          !profile ?
            <Connected
              connectedData={connectedData}
              searchdata={searchdata}
              setsearchdata={setsearchdata}
              friends={friends}
              searchicon={searchicon}
              setsearchicon={setsearchicon}
              ws={ws}
              smallscreen={smallscreen}
              usersprofilephoto={usersprofilephoto}
            />
            :
            <Profilesection />
        }
      </div>
      <div
        ref={section2ref}
        className="section-2"
        style={{
          width: screenWidth <= 550 ? "100vw" : screenWidth <= 768 ? "calc(100vw - 200px)" : "calc(100vw - 400px)",
          display: screenWidth <= 550 ? "none" : "block",
          backgroundImage: window.location.href === 'http://127.0.0.1:3000/chats' ? `url(${logo})` : null
        }}
      >
        {
          !profile ? <Message
            connectedData={connectedData}
            userdata={searchicon ? friends : searchdata}
            friends={friends}
            searchicon={searchicon}
            setsearchicon={setsearchicon}
            ws={ws}
            getusers={getusers}
            getfriends={getfriends}
            smallscreen={smallscreen}
            disable={disable}
            setdisable={setdisable}
            setfriends={setfriends}
            usersprofilephoto={usersprofilephoto}
          /> : null
        }
      </div>
    </div>
  )
}

export default Main
