// src/app/ui/fonts.ts
import localFont from 'next/font/local'

export const satoshi = localFont({
  src: [
    { path: '../../public/fonts/Satoshi-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Satoshi-Medium.otf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Satoshi-Bold.otf', weight: '700', style: 'normal' }
  ],
  display: 'swap',
  variable: '--font-satoshi'
})
