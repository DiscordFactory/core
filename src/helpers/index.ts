import path from 'path'

export const root = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), 'build', 'src')
  : path.join(process.cwd(), 'src')