import React, { useEffect, useState } from 'react'
import Main from '../../components/Main/Main'
import axios from 'axios'
import moment from 'moment'


function Chats() {
  const [users, setusers] = useState([])
  const [friends, setfriends] = useState([])
  const [usersprofilephoto, setusersprofilephoto] = useState([])
  const token = JSON.parse(localStorage.getItem("token"))


  const getusers = async () => {
    await axios({
      method: "get",
      url: "http://127.0.0.1:8000/account/api/user/Alluser",
      headers: {
        'Authorization': `Bearer ${token.access}`,
        'Content-Type': "application/json"
      }
    })
      .then((Response) => {
        setusers(Response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getfriends = async () => {
    await axios({
      method: 'get',
      url: "http://127.0.0.1:8000/account/api/user/UserFriend",
      headers: {
        'Authorization': `Bearer ${token.access}`,
        'Content-Type': "application/json"
      }
    })
      .then((Response) => {
        setfriends(Response.data.data.slice().sort((b, a) => moment(a?.time).valueOf() - moment(b?.time).valueOf()))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getprofilephotos = async () => {
    await axios({
      method: 'get',
      url: "http://127.0.0.1:8000/account/api/user/allProfile",
      headers: {
        'Authorization': `Bearer ${token.access}`,
        'Content-Type': "application/json"
      }
    }).then(Response => {
      console.log("images", Response)
      setusersprofilephoto(Response.data)
    }).catch(error => {
      console.log('image error', error)
    })
  }

  useEffect(() => {
    getusers()
    getfriends()
    getprofilephotos()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Main
        connectedData={users}
        friends={friends}
        getusers={getusers}
        getfriends={getfriends}
        setfriends={setfriends}
        usersprofilephoto={usersprofilephoto}
      />
    </>
  )
}

export default Chats
