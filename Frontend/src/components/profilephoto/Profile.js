import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import './profile.css'

function Profile({ profilesrc }) {
  return (
    profilesrc === "No image" ? (
      <div className="noprofile">
        <FontAwesomeIcon icon={faUser} color='#75777a' size='2x' />
      </div>
    ) : (
      <div className="yesprofile" style={{ backgroundImage: `url(${profilesrc})` }}></div>
    )

  )
}

export default Profile
