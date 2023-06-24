import { ThemeProvider } from '@/theme'
import { defaultMetadata } from '@/utils'

export const metadata = defaultMetadata

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
