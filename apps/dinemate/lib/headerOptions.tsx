
import NotificationButton from '@/components/NotificationButton'
import { BsThreeDotsVertical } from 'react-icons/bs'
export const headerOptions = [
  {
    name: 'Cart',
    href: '/cart',
    icon: <NotificationButton/>
  },
  {
    name: 'Assistance',
    href: '/assist',
    icon: <NotificationButton/>
  },
  {
    name: 'Share QR',
    href: '/share',
    icon: <NotificationButton/>
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: <BsThreeDotsVertical/>
  }, 
]