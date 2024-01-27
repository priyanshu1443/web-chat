import React from 'react'
import { NavLink } from 'react-router-dom'

import './connected.css'
import Search from '../search/Search'
import Profile from '../profilephoto/Profile'

function Connected({
  connectedData,
  searchdata,
  setsearchdata,
  friends,
  searchicon,
  setsearchicon,
  ws,
  smallscreen,
  usersprofilephoto
}) {


  const chat_group = window.location.href.includes("chats")

  const closewsconnection = () => {
    smallscreen("tomsg")
    if (ws.current !== null && ws.current.readyState !== WebSocket.CLOSED) {
      ws.current.close()
      console.log("websocket connection is closed")
    }
  }

  const showuserslist = (user) => {
    return (
      <>
        {
          user.length === 0 ? (
            chat_group ? <p >Search users</p> : <p>Groups not found</p>
          ) : (
            user.map(userData => {
              return (
                <NavLink
                  className={`connected_link`}
                  key={userData.id} to={`/${chat_group ? "chats" : "groups"}/${userData.id}`}
                  onClick={() => { closewsconnection() }}
                >
                  <div className={`users_group `}>
                    {
                      usersprofilephoto.map(photo => photo.user).includes(userData.id) ?
                        usersprofilephoto.filter(id => id.user === userData.id).map(photo => { return (<Profile profilesrc={photo.profile_img} />) }) :
                        <Profile profilesrc={"No image"} />
                    }
                    <div className="users_groups_details">
                      <p className="users_groups_name">{userData.name}</p>
                    </div>
                  </div>
                </NavLink>
              )
            })
          )
        }
      </>
    )
  }



  return (
    <div className='connected'>
      <Search
        connectedData={connectedData}
        setsearchdata={setsearchdata}
        searchicon={searchicon}
        setsearchicon={setsearchicon}
      />
      <div className="connected_user_group">
        {searchicon ?
          friends.map(friend => showuserslist(connectedData.filter(data => data.id === friend.friend))) :
          showuserslist(searchdata)}

      </div>
    </div>
  )
}

export default Connected
