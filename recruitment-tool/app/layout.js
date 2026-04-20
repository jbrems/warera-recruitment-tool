import './globals.css'

export const metadata = {
  title: 'Warera User Growth Analytics',
  description: 'Mobile-first analytics dashboard visualizing user growth data',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
