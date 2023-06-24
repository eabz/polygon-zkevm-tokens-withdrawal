import { Metadata } from 'next'

const description = 'Another Next.js boilerplate'

const url = 'https://kindynos.mx'

const title = 'Next.js boilerplate'

export const defaultMetadata: Metadata = {
  description,
  icons: {
    apple: [
      { type: 'image/png', url: '/static/apple-icon.png' },
      { sizes: '57x57', type: 'image/png', url: '/static/apple-icon-57x57.png' },
      { sizes: '60x60', type: 'image/png', url: '/static/apple-icon-60x60.png' },
      { sizes: '72x72', type: 'image/png', url: '/static/apple-icon-72x72.png' },
      { sizes: '76x76', type: 'image/png', url: '/static/apple-icon-76x76.png' },
      { sizes: '114x114', type: 'image/png', url: '/static/apple-icon-114x114.png' },
      { sizes: '120x120', type: 'image/png', url: '/static/apple-icon-120x120.png' },
      { sizes: '144x144', type: 'image/png', url: '/static/apple-icon-144x144.png' },
      { sizes: '152x152', type: 'image/png', url: '/static/apple-icon-152x152.png' },
      { sizes: '180x180', type: 'image/png', url: '/static/apple-icon-180x180.png' },
    ],
    icon: [{ url: '/static/apple-icon.png' }, new URL('/static/apple-icon.png', 'https://kindynos.mx')],
    other: {
      rel: 'apple-icon-precomposed',
      url: '/static/apple-icon-precomposed.png',
    },
    shortcut: ['/static/apple-icon.png'],
  },
  manifest: '/static/manifest.json',
  openGraph: {
    description,
    title,
    type: 'website',
    url,
  },
  themeColor: '#426DA9',
  title,
}
