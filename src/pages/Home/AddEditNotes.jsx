import { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md'
import axiosInstance from './../../utils/axiosInstance'

const AddEditNotes = ({
  handleShowToastMessage,
  getAllNotes,
  noteData,
  type,
  onClose
}) => {
  const [title, setTitle] = useState(noteData?.title || '')
  const [content, setContent] = useState(noteData?.content || '')
  const [tags, setTags] = useState(noteData?.tags || [])

  const [error, setError] = useState(null)

  // add note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post('/v1/add-note', {
        title,
        content,
        tags
      })

      if (response.data && response.data.note) {
        handleShowToastMessage('Note added successfully')
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      }
    }
  }

  //Edit note
  const editNote = async () => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put('/v1/edit-note/' + noteId, {
        title,
        content,
        tags
      })

      if (response.data && response.data.note) {
        handleShowToastMessage('Note updated successfully')
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      }
    }
  }

  const handleAddNote = () => {
    if (!title) {
      setError('Please enter the title')
      return
    }

    if (!content) {
      setError('Please enter the Content')
      return
    }

    setError('')

    if (type === 'edit') {
      editNote()
    } else {
      addNewNote(title, content)
    }
  }

  return (
    <div className='relative'>
      <button
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'
        onClick={onClose}>
        <MdClose className='text-xl text-slate-400' />
      </button>

      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input
          type='text'
          className='text-2xl text-slate-950 outline-none p-2'
          placeholder='Go to gym at 5'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea
          type='text'
          className='text-sm text-slate-950 bg-slate-100 outline-none p-2'
          placeholder='Content'
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}></textarea>
      </div>

      <div className='mt-3'>
        <label className='input-label'>TAGS/LABEL</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      <button
        className='btn-primary font-medium mt-5 p-3'
        onClick={handleAddNote}>
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  )
}

export default AddEditNotes
