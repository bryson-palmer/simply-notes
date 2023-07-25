import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import url from 'url'
import path from 'path'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, 'src') }]
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `https://simple-notes-gamma.vercel.app/assets/[name].js`,
        chunkFileNames: `https://simple-notes-gamma.vercel.app/assets/[name].js`,
        assetFileNames: `https://simple-notes-gamma.vercel.app/assets/[name].[ext]`
      }
    }
  }
})
