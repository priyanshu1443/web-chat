import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import moment from 'moment/moment'

import './message.css'
import Profile from '../profilephoto/Profile'
import Chat from './Chat'


function Message({
  connectedData,
  userdata,
  friends,
  searchicon,
  setsearchicon,
  ws,
  getusers,
  getfriends,
  smallscreen,
  disable,
  setdisable,
  setfriends,
  usersprofilephoto
}) {


  const [showfriendprofile, setshowfriendprofile] = useState(false)
  const [chatdata, setchatdata] = useState([])
  const [inputmsg, setinputmsg] = useState("")
  const [slug, setslug] = useState('')
  const [key, setkey] = useState('')
  const [friendid, setfriendid] = useState('')
  const token = JSON.parse(localStorage.getItem("token"))
  const currentuser = JSON.parse(localStorage.getItem("user"))



  const navigate = useNavigate()

  const { id } = useParams()
  const chat_group = window.location.href.includes("chats")

  useEffect(() => {
    setchatdata([])
    const slugdata = friends.filter(friend => friend.friend === parseInt(id))
    if (slugdata.length === 1) {
      setfriendid(slugdata[0].friend)
      setslug(slugdata[0].slug)
      setkey(slugdata[0].key)
    }
    if (id !== undefined && searchicon === true) {
      // connectwebsocket(slugdata[0].key)
      console.log(friendid)
    }
    // eslint-disable-next-line
  }, [id])


  const handlesendmsg = async () => {
    const time = new Date()
    const hour = time.getHours()
    const minute = time.getMinutes()

    const message = {
      method: 'message',
      sender: currentuser.id,
      content: inputmsg,
      targetRoomId: key,
      time: `${hour > 12 ? hour - 12 : hour} : ${minute} ${hour > 12 ? 'P.M.' : 'A.M.'}`
    }

    ws.current.send(JSON.stringify(message))
    setinputmsg('')

    await axios({
      method: "put",
      url: `http://127.0.0.1:8000/account/api/user/userfriendbothtime/${slug}/${moment().format().toLocaleString()}/`,
      headers: {
        Authorization: `Bearer ${token.access}`,
        'Content-Type': 'multipart/form-data',
      }
    }).then(responce => {
      setfriends([])
      setfriends(responce.data.slice().sort((b, a) => moment(a?.time).valueOf() - moment(b?.time).valueOf()))
    }).catch(error => {
      console.log("update time error", error)
    })
  }


  const handleBack = () => {
    smallscreen('tolist')
    if (disable && ws.current.readyState !== WebSocket.CLOSED) {
      ws.current.close()
      console.log("websocket connection is closed")
      setdisable(false)
    }
    setshowfriendprofile(false)
    if (chat_group) {
      navigate("/chats")
    } else {
      navigate('/groups')
    }
  }

  const addfriend = async () => {
    const makefriend = connectedData.filter((user) => user.id === parseInt(id))
    console.log(makefriend)
    await axios({
      method: "post",
      url: "http://127.0.0.1:8000/account/api/user/UserFriend",
      headers: {
        'Authorization': `Bearer ${token.access}`,
        'Content-Type': "application/json"
      },
      data: {
        user: currentuser.id,
        friend: makefriend[0].id,
        key: `${currentuser.id}_${makefriend[0].id}`,
        time: moment().format().toLocaleString()
      },
    })
      .then((responce) => {
        console.log(responce)
        setsearchicon(true)
        getusers()
        getfriends()
        navigate('/chats')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const message_area = (udata) => {
    return (
      udata.filter((data) => data.id === parseInt(id)).map((data) => {
        return (
          <div>
            <div className="message_head" >
              <div>
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => handleBack()} />
                {
                  usersprofilephoto.map(photo => photo.user).includes(data.id) ?
                    usersprofilephoto.filter(id => id.user === data.id).map(photo => { return (<Profile profilesrc={photo.profile_img} />) }) :
                    <Profile profilesrc={"No image"} />
                }
                {data.name}
              </div>
              <button onClick={() => { setshowfriendprofile(!showfriendprofile) }}>{showfriendprofile ? "Hide" : "Show"} profile</button>
            </div>
            {!showfriendprofile ?
              searchicon === true ?
                (<Chat ws={ws} friends={friends} chatdata={chatdata} setchatdata={setchatdata} setdisable={setdisable} />) :
                friends.filter(id => id.friend === data.id).length === 1 ?
                  <Chat ws={ws} friends={friends} chatdata={chatdata} setchatdata={setchatdata} setdisable={setdisable} /> : (
                    <div className="message_container">
                      <div className="backgroundimage"></div>
                      <div className="content">
                        <div className="connectsection">
                          <div>
                            <p><b><span>{data.name}</span> <br /> is not in your friendList</b></p>
                            <button onClick={() => addfriend()}> <b>Add friend</b> </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) :
              <div className='friendprofile'>
                <div>
                  {
                    usersprofilephoto.map(photo => photo.user).includes(data.id) ?
                      usersprofilephoto.filter(id => id.user === data.id).map(photo => {
                        return (
                          <div className='friendimg' style={{ backgroundImage: `url(${photo.profile_img})` }}></div>
                        )
                      }) :
                      <div className="friendimgno">
                        <FontAwesomeIcon icon={faUser} color='#75777a' size='7x' />
                      </div>
                  }
                </div>
                <div className='friendname'>
                  <p>Username :</p>
                  <p>{data.name}</p>
                </div>
                {/* <div className='friendname'>
                  <p>Contact Number :</p>
                  <p>{data?.contact}</p>
                </div> */}
                <div className='friendemail'>
                  <p>Email: </p>
                  <p>{data.email}</p>
                </div>
              </div>
            }
            {
              showfriendprofile ?
                null :
                <div className="message_footer" >
                  <div>
                    <input
                      type="text"
                      placeholder='Enter your massage here ...'
                      value={inputmsg}
                      onChange={(e) => setinputmsg(e.target.value)}
                      disabled={slug ? false : true}
                    />
                  </div>
                  {console.log(slug)}
                  <button
                    onClick={() => handlesendmsg()}
                    disabled={slug ? false : true}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} color='#000000' size='2x' />
                  </button>
                </div>
            }
          </div >
        )
      })
    )
  }

  return (
    id === undefined ?
      null :
      searchicon ?
        friends.map(friend => message_area(connectedData.filter(data => data.id === friend.friend))) :
        message_area(userdata)
  )
}

export default Message
