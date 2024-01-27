import React from 'react'
import { Routes, Route } from 'react-router-dom'

import "./app.css"
import Indexpage from './pages/Indexpage/Indexpage'
import Chats from './pages/chats/Chats'
// import Groups from './pages/groups/Groups'
import Auth from './pages/auth/Auth'
import Profilepage from './pages/profilepage/Profilepage'

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Indexpage />} />
      <Route exact path='/profile' element={<Profilepage />} />
      <Route exact path='/chats' element={<Chats />} />
      <Route exact path='/chats/:id' element={<Chats />} />
      {/* <Route exact path='/groups' element={<Groups />} /> */}
      {/* <Route exact path='/groups/:id' element={<Groups />} /> */}
      <Route exact path='/Auth' element={<Auth />} />
    </Routes>
  )
}

export default App
