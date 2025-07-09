import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TenTwenty Farms - From Our Farms To Your Hands',
  description: 'Premium farm products delivered fresh from our farms to your hands',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}