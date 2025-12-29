import type { Metadata } from 'next'
import '../../globals.css'

export const metadata: Metadata = {
    title: 'Component Preview - Athrean',
    description: 'Component preview',
}

export default function PreviewLayout({
    children,
}: {
    children: React.ReactNode
}): React.ReactElement {
    // Don't apply dark class by default - let the page control it
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    )
}
