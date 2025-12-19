// src/app/ui/fonts.ts
import localFont from 'next/font/local';

export const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi.otf',
      weight: '400',
      style: 'normal',
    },
    
    // Add other weights and styles as needed
  ],
  display: 'swap', // Ensures text is visible while the font is loading
  variable: '--font-satoshi', // Optional: for use with CSS variables (e.g., in Tailwind CSS)
});
