import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import HomeNavbar from '../../(user)/_components/home-navbar'
import { UserWorkspaceContextProvider } from '../../_components/user-workspace-context'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import BuilderFormProvider from '../_components/builder-form-context'
import appConfig from '~/config/app.config'
import { cn } from '@codevs/ui'
import Card from '~/types/cards'
import { getBuilderProfileData, getCardById } from '../actions'
import ProfileContextProvider from '~/components/profile-context'
import { ManageProfileData } from '~/lib/profile-data'

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

  const card = await getCardById(params.id, data.id)
  const builderProfileData = await getBuilderProfileData(card.id)
  return (
    <html lang={appConfig.locale}>
      <body className={cn(inter.className, appConfig.theme)}>
        <UserWorkspaceContextProvider value={data}>
          <div className="bg-secondary fixed -z-10 h-full w-full"></div>
          <HomeNavbar />
          <BuilderFormProvider cardData={card as Card}>
            <ProfileContextProvider
              manageProfileData={builderProfileData as ManageProfileData}
            >
              {children}
            </ProfileContextProvider>
          </BuilderFormProvider>
        </UserWorkspaceContextProvider>
      </body>
    </html>
  )
}
