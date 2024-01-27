import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import './search.css'

function Search({ connectedData, setsearchdata, searchicon, setsearchicon }) {

  const inputRef = useRef()
  const [search, setsearch] = useState('')

  const handleSearch = (e) => {
    setsearch(e.target.value)
    const value = connectedData.filter((name) => name.name.toLowerCase().includes(search.toLocaleLowerCase()))
    if (search === '') {
      setsearchdata(connectedData)
    }
    else {
      setsearchdata(value)
    }
  }

  const handleSearchClick = () => {
    inputRef.current.focus()
    setsearchicon(false)
    setsearchdata([])
  }

  const handleBackClick = () => {
    setsearch('')
    setsearchicon(true)
    setsearchdata(connectedData)
    setsearch('')
  }

  return (
    <div className='search'>
      {
        searchicon ? (
          <div className='search_icon' onClick={() => handleSearchClick()}>
            <FontAwesomeIcon icon={faMagnifyingGlass} color='#000000' />
          </div>
        ) : (
          <div className="search_icon" onClick={() => handleBackClick()}>
            <FontAwesomeIcon icon={faArrowLeft} color='#000000' />
          </div>
        )
      }
      <label htmlFor="search">
        <input
          ref={inputRef}
          type="text"
          placeholder='Search and start a new chat'
          autoComplete='off'
          onClick={() => handleSearchClick()}
          value={search}
          onChange={(e) => handleSearch(e)}
        />
      </label>
    </div>
  )
}

export default Search
