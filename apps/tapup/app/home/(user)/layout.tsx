import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { UserWorkspaceContextProvider } from '../_components/user-workspace-context'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import HomeSidebar from './_components/home-sidebar'
import HomeNavbar from './_components/home-navbar'
import appConfig from '~/config/app.config'
import { cn } from '@codevs/ui'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', user?.id)
    .single()

  return (
    <html lang={appConfig.locale}>
      <body className={cn(inter.className, appConfig.theme)}>
        <UserWorkspaceContextProvider value={data}>
          <div className="flex gap-0">
            <div className="relative h-screen w-1/5">
              <HomeSidebar />
            </div>
            <div className="h-screen flex-1 overflow-scroll bg-slate-100">
              <HomeNavbar />
              {children}
            </div>
          </div>
        </UserWorkspaceContextProvider>
      </body>
    </html>
  )
}
