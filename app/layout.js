
import './globals.css'
import { satoshi } from './ui/fonts';

export const metadata = {
  title: 'AI-Powered Palm Reader | Unlock Your Future',
  description: 'World\'s Best AI-Powered Palm Reader. Unlock insights into your future with expert palm readings—in seconds.',
  keywords: 'palm reading, AI, fortune telling, future prediction, palmistry',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={satoshi.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=sathosi+Display:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
