import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Olivia's First Birthday 🍊",
  description: "You're invited to celebrate Olivia Iyer's first birthday — May 17th, 2026",
  openGraph: {
    title: "Olivia's First Birthday 🍊",
    description: 'Sunday, May 17th · 10:30 AM–1:30 PM · Arlington, VA',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
