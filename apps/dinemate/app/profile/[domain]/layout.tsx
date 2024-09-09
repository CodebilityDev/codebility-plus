import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
  return (
    <html lang={appConfig.locale}>
      <body className={cn(inter.className, appConfig.theme)}>{children}</body>
    </html>
  )
}
