import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
})
import './globals.css'

export const metadata: Metadata = {
  title: 'Food Wagen',
  description: 'For Foodies',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>{children}</body>
    </html>
  )
}
