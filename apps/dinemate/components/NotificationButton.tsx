
import { notifData } from '~/lib/notifications'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotificationButton = () => {
  const unreadCount = notifData.filter((notif) => !notif.isRead).length
  return (
    <Link className='relative'
      href={'/app/notifications'}
    >
      <Bell/>
      {unreadCount > 0 && 
        <div className='w-3 h-3 bg-red-500 rounded-full absolute top-0 right-0'>
          <span className='text-white text-[9px] font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>{unreadCount}</span>
        </div>
      }
    </Link>
  )
}

export default NotificationButton