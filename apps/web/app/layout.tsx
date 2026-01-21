import type { Metadata } from 'next'
import './globals.css'
import { SmoothScroll } from "@/components/smooth-scroll"

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-sans bg-zinc-950 text-white`}
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
