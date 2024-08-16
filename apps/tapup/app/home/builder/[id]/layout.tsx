import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import HomeNavbar from '../../(user)/_components/home-navbar'
import { UserWorkspaceContextProvider } from '../../(user)/_components/user-workspace-context'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import BuilderFormProvider from '../_components/builder-form-context'
import appConfig from '~/config/app.config'
import { cn } from '@codevs/ui'
import { Card } from '../_types/cards'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { id: string }
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

  const { data: card, error: fetchingCardError } = await supabase
    .from('cards')
    .select(
      `id,
       name,
       username_url,
       status,
       industry`,
    )
    .eq('id', params.id)
    .eq('user_id', user?.id)
    .single()

  return (
    <html lang={appConfig.locale}>
      <body className={cn(inter.className, appConfig.theme)}>
        <UserWorkspaceContextProvider value={data}>
          <div className="fixed -z-10 h-full w-full bg-slate-100"></div>
          <HomeNavbar />
          <BuilderFormProvider cardData={card as Card}>
            {children}
          </BuilderFormProvider>
        </UserWorkspaceContextProvider>
      </body>
    </html>
  )
}
