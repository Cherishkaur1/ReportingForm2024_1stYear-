import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, './certs/server.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, './certs/STAR_ctuniversity_in.crt')),
    //   ca: fs.readFileSync(path.resolve(__dirname, './certs/My_CA_Bundle.ca-bundle')),
    // },
    port: 1001, // Set the port to 80 for http 443 for https
    host: '0.0.0.0', // Allow connections from any IP address
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:1000',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // }
  }
})
