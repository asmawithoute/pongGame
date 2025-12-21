import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: [
      '.loca.lt',
      'localhost'
    ]
  }
})
