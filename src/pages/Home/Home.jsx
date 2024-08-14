import Navbar from './../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import AddEditNotes from './AddEditNotes'
import { MdAdd } from 'react-icons/md'
import Modal from 'react-modal'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance/'
import AddNotesImg from '../../assets/images/add-note.svg'
import NoData from '../../assets/images/no-data.svg'

const Home = () => {
  const navigate = useNavigate()
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null
  })
  const [showToastMessage, setShowToastMessage] = useState({
    isShown: false,
    message: '',
    type: 'add'
  })

  const [userInfo, setUserInfo] = useState(null)
  const [allNotes, setAllNotes] = useState([])

  const [isSearch, setIsSearch] = useState(false)

  // Get user info api
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/v1/get-user')

      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear()
        navigate('/login')
      } else {
        console.error('Error fetching user info:', error)
      }
    }
  }

  // Get All notes api
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/v1/get-all-notes')

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again')
    }
  }

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get('/v1/search-notes/', {
        params: { query }
      })

      if (response.data && response.data.notes) {
        setIsSearch(true)
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again', error)
    }
  }

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put('/v1/update-note-pinned/' + noteId, {
        isPinned: !noteData.isPinned
      })

      if (response.data && response.data.note) {
        handleShowToastMessage('Note updated successfully')
        getAllNotes()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false)
    getAllNotes()
  }

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data: noteDetails
    })
  }

  const handleDelete = async (noteId) => {
    try {
      const response = await axiosInstance.delete('/v1/delete-note/' + noteId)

      if (response.data && !response.data.error) {
        handleShowToastMessage('Note deleted successfully', 'delete')
        getAllNotes()
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log('An unexpected error occurred. Please try again')
      }
    }
  }

  const handleShowToastMessage = (message, type) => {
    setShowToastMessage({ isShown: true, message, type })
  }

  const handleCloseToast = () => {
    setShowToastMessage({ isShown: false, message: '' })
  }

  useEffect(() => {
    getUserInfo()
    getAllNotes()
  }, [])

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className='container mx-auto'>
        {allNotes.length > 0 ? (
          <div className='grid grid-cols-4 gap-4 mt-8 px-6'>
            {allNotes.map((note, index) => (
              <NoteCard
                key={index}
                title={note.title}
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPined={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDelete(note._id)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoData : AddNotesImg}
            message={
              isSearch
                ? `No notes found matching  your search `
                : `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started`
            }
          />
        )}
      </div>
      <button
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: 'add',
            data: null
          })
        }}>
        <MdAdd className='text-[32px] text-white' />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        ariaHideApp={false}
        onRequestClose={() => {
          setOpenAddEditModal({
            isShown: false,
            type: 'add',
            data: null
          })
        }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }
        }}
        contentLabel=''
        className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5'>
        <AddEditNotes
          handleShowToastMessage={handleShowToastMessage}
          getAllNotes={getAllNotes}
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({
              isShown: false,
              type: 'add',
              data: null
            })
          }}
        />
      </Modal>

      <Toast
        isShown={showToastMessage.isShown}
        message={showToastMessage.message}
        type={showToastMessage.type}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home
