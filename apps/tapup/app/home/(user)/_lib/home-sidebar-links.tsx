import {
  FolderDown,
  LayoutDashboard,
  LucideGitGraph,
  Settings,
  UserCircle,
  SquareUserRound,
} from 'lucide-react'
import pathsConfig from '~/config/paths.config'
export type SidebarLink = {
  key: string
  label: string
  path: string
  icon: JSX.Element
  subLinks?: {
    key: string
    label: string
    path: string
    icon?: JSX.Element
  }[]
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: pathsConfig.app.home,
    icon: <LayoutDashboard />,
    subLinks: [
      {
        key: 'analytics',
        label: 'Analytics',
        path: '/dashboard/analytics',
        icon: <LucideGitGraph />,
      },
    ],
  },
  {
    key: 'my_cards',
    label: 'My Cards',
    path: pathsConfig.app.cards,
    icon: <SquareUserRound />,
  },
  {
    key: 'integrations',
    label: 'Integrations',
    path: '/dashboard/integrations',
    icon: <FolderDown />,
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/dashboard/settings',
    icon: <Settings />,
  },
]

export const MOBILE_MENU = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    key: 'profile',
    label: 'Profile',
    path: '/dashboard/profile',
    icon: <UserCircle size={20} />,
  },
  {
    key: 'services',
    label: 'Services',
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    key: 'integrations',
    label: 'Integrations',
    path: '/dashboard/integrations',
    icon: <FolderDown size={20} />,
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/dashboard/settings',
    icon: <Settings size={20} />,
  },
]
