
import NotificationButton from '~/components/NotificationButton'
import { BsThreeDotsVertical } from 'react-icons/bs'
export const headerOptions = [
  {
    name: 'Cart',
    href: '/app/cart',
    icon: <NotificationButton/>
  },
  {
    name: 'Assistance',
    href: '/app/assist',
    icon: <NotificationButton/>
  },
  {
    name: 'Share QR',
    href: '/app/share',
    icon: <NotificationButton/>
  },
  {
    name: 'Notifications',
    href: '/app/notifications',
    icon: <BsThreeDotsVertical/>
  }, 
]