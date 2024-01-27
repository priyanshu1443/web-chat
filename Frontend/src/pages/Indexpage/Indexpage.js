import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Indexpage() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/Auth')
    // navigate("/chats")
    // eslint-disable-next-line
  }, [])
  return (
    <>
    </>
  )
}

export default Indexpage
