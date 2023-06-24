import { RainbowKit } from '@/components'
import { ThemeProvider } from '@/theme'
import { defaultMetadata } from '@/utils'

export const metadata = defaultMetadata

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <RainbowKit>{children}</RainbowKit>
        </ThemeProvider>
      </body>
    </html>
  )
}
