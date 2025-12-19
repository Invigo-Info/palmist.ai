
import './globals.css'
import { satoshi } from './ui/fonts'

export const metadata = {
  title: 'AI-Powered Palm Reader | Unlock Your Future',
  description: 'World\'s Best AI-Powered Palm Reader. Unlock insights into your future with expert palm readings—in seconds.',
  keywords: 'palm reading, AI, fortune telling, future prediction, palmistry',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className={satoshi.className}>{children}</body>
    </html>
  )
}
