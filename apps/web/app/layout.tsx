import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Athrean - Beautiful React Components',
  description: 'Browse curated animated components or let AI design custom ones for you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
