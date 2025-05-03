import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),mkcert()],
  server: {
    proxy: {
      '/reminders' :'https://ru8ffu9g27.execute-api.ap-south-1.amazonaws.com/prod/'
    }
  }
})
