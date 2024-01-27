import React from 'react'
import Main from '../../components/Main/Main'


function Groups() {
  const connectedData = [
    { id: '1', name: "Group 1" },
    { id: '2', name: "Group 2" },
    { id: '3', name: "Group 3" }
  ]
  return (
    <Main connectedData={connectedData} />
  )
}

export default Groups
