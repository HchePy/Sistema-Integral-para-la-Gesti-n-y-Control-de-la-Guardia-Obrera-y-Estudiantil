import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Habilitar acceso de red para Docker
    watch: {
      usePolling: true, // Asegura que los cambios se detecten dentro de Docker en Windows
    }
  }
})
