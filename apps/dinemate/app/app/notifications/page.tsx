'use client'
import { notifData } from '~/lib/notifications'
import React from 'react'
import { GoDotFill } from 'react-icons/go'

const NotificationPage = () => {
  return (
    <section className='h-screen pt-10 '>
        <div className=' !absolute left-0 w-full pt-8 bg-white'>
          <h2 className='p-2'>Unread</h2>
          {notifData?.map((notif, index) => (
            <>
              {notif?.isRead ? null : 
                <div key={index}
                  className='bg-[#FF680D1F] border border-opacity-30 border-[#E4E8EE]'
                  onClick={() => notif.isRead = true}
                >
                    <div className='pb-4 pt-2'>
                      <div className="pt-1 ps-1">
                        <GoDotFill size={16} color='#FF680D'/>
                      </div>
                      <p className='px-4'>{notif?.message}</p>
                    </div>
                </div>
              }
            </>
          ))}
          <h2 className='p-2'>Read</h2>
          {notifData?.map((notif, index) => (
            <>
              {!notif?.isRead ? null : 
                <div key={index}
                  className='border-t border-opacity-30 border-[#E4E8EE]'
                >
                    <div className='p-4'>
                      <p>{notif?.message}</p>
                    </div>
                </div>
              }
            </>
          ))}
        </div>
    </section>
  )
}

export default NotificationPage