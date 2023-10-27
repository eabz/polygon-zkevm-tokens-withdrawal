const plugins = []

const config = {
  images: {
    remotePatterns: [
      {
        hostname: '**',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
}

const moduleExports = () => plugins.reduce((acc, next) => next(acc), config)

module.exports = moduleExports
