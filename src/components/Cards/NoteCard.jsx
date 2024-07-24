import { MdOutlinePushPin } from 'react-icons/md'
import { MdCreate, MdDelete } from 'react-icons/md'
import moment from 'moment'

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPined,
  onEdit,
  onDelete,
  onPinNote
}) => {
  return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
      <div className='flex items-center justify-between'>
        <div>
          <h5 className='text-sm font-medium'>{title}</h5>
          <span className='text-xs text-slate-500'>
            {moment(date).format('Do MMM YYYY')}
          </span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${isPined ? 'text-primary' : 'text-slate-400'}`}
          onClick={onPinNote}
        />
      </div>
      <p className='text-xs text-slate-600 mt-2'>{content?.slice(0, 60)}</p>

      <div className='flex items-center justify-between mt-2'>
        <div className='text-xs text-slate-500'>
          {tags.map((tag, index) => `#${tag} `)}
        </div>
        <div className='flex items-center gap-2'>
          <MdCreate
            className='icon-btn hover:text-green-600 cursor-pointer text-slate-400'
            onClick={onEdit}
          />
          <MdDelete
            className='icon-btn hover:text-red-500 cursor-pointer text-slate-400'
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  )
}

export default NoteCard
