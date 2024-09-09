import Link from 'next/link'
import { BsPersonCircle } from 'react-icons/bs'

const AdminButton = () => {
  return (
    <Link href={'/admin-account'}
      className='flex items-center gap-4 px-[10px] py-5 hover:bg-gray-200 rounded-lg'
    >
      <BsPersonCircle size={16}/>
      <span>Admin Account</span>
    </Link>
  )
}

export default AdminButton