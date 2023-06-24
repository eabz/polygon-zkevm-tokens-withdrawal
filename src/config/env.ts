export const env = {
  NODE_ENV: process.env.NODE_ENV,
}

export const isProd = env.NODE_ENV === 'production'
