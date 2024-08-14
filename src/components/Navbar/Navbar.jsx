import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { useState } from 'react'
import axiosInstance from './../../utils/axiosInstance'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const onLogOut = async () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }
  const onClearSearch = () => {
    setSearchQuery('')
    handleClearSearch()
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className='text-2xl font-medium text-black py-2'>Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />
    </div>
  )
}

export default Navbar
