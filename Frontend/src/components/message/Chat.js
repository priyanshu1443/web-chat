import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faTrashCan, } from '@fortawesome/free-solid-svg-icons'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import send from "../../assets/audio/send.mp3"
import recieve from '../../assets/audio/recieve.mp3'

function Chat({ ws, friends, chatdata, setchatdata, setdisable }) {

  const contentref = useRef()
  const sendref = useRef(null)
  const recieveref = useRef(null)

  const currentuser = JSON.parse(localStorage.getItem("user"))

  const { id } = useParams()

  useEffect(() => {
    setdisable(true)
    const keydata = friends.filter(friend => friend.friend === parseInt(id))
    ws.current = new WebSocket(`ws://127.0.0.1:8001/ws/chat/${keydata[0].key}/`)

    ws.current.onopen = () => {
      console.log("websocket.connection open")
      ws.current.send(JSON.stringify({
        method: 'get',
        targetRoomId: keydata[0].key,
      }))
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log(data)

      if (data.status === "Data Received") {
        setchatdata(data.message)
      }
      else if (data.status === "After deleted message") {
        setchatdata([])
        setchatdata(data.message)
        console.log("after delete msg", data.message)
      }
      else if (data.status === "No Data available") {

      }
      else {
        console.log(data.message)
        // data.sender === currentuser.id ? sendref.current.play() : recieveref.current.play()
        if(data.sender === currentuser.id){
          if(sendref.current){
            sendref.current.play()
          }
        }
        else{
          if(recieveref.current){
            recieveref.current.play()
          }
        }
        setchatdata(prevdata => [...prevdata, data])
      }
    }

    ws.current.onclose = () => {
      console.log("websocket connection is closed")
    }
    // eslint-disable-next-line
  }, [ws])

  useEffect(() => {
    contentref.current.scrollTop = contentref.current.scrollHeight
  }, [chatdata])

  const handledelete = (msg) => {
    console.log(msg.userfriend)
    const message = {
      method: 'delete',
      id: msg.id,
      sender: parseInt(currentuser.id),
      targetRoomId: msg.userfriend
    }
    console.log("before delete", message)
    ws.current.send(JSON.stringify(message))
  }

  return (
    <div className="message_container">
      <audio ref={sendref} src={send}/>
      <audio ref={recieveref} src={recieve}/>
      <div className="backgroundimage"></div>
      <div ref={contentref} className="content">
        {
          chatdata.map((msg) => {
            return (
              <div className='message_body'>
                <div
                  className=" message"
                  style={{
                    alignSelf: msg.sender === parseInt(currentuser.id) ? "end" : "start",
                    backgroundColor: msg.sender === parseInt(currentuser.id) ? "white" : "white"
                  }}
                >
                  <div className="message_content"  >{msg.content}</div>
                  <div
                    className="message_time"
                  // style={{ alignSelf: msg.sender === parseInt(currentuser.id) ? "start" : "end" }}
                  >
                    <div>
                      <b>{msg.time}</b>
                    </div>
                  </div>
                  <div className='getoptions'>
                    <FontAwesomeIcon icon={faEllipsisVertical} color='#787a7d'
                      onMouseOver={() => {
                        console.log("work")
                      }}
                    />
                    <div className='options'
                      style={{
                        left: msg.sender === parseInt(currentuser.id) ? "-105px" : "15px",
                        top: "7px",
                        height: msg.sender === parseInt(currentuser.id) ? "93px" : '43px'
                      }}
                    >
                      <ul>
                        <li>
                          <CopyToClipboard text={msg.content}>
                            <div>
                              <FontAwesomeIcon icon={faCopy} color='white' />
                              <span>Copy</span>
                            </div>
                          </CopyToClipboard>
                        </li>
                        <hr style={{ display: msg.sender === parseInt(currentuser.id) ? "flex" : 'none' }} />
                        <li onClick={() => handledelete(msg)} style={{ display: msg.sender === parseInt(currentuser.id) ? "flex" : 'none' }}>
                          <FontAwesomeIcon icon={faTrashCan} color='white' />
                          <span>Delete</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Chat
