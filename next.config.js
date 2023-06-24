const plugins = []

const config = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
}

const moduleExports = () => plugins.reduce((acc, next) => next(acc), config)

module.exports = moduleExports
