
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-gray-900">
      <body className="bg-gray-900 min-h-screen">{children}</body>
    </html>
  )
}
