import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Render and most PaaS hosts inject the port to bind to via PORT.
const previewPort = Number(process.env.PORT) || 4173

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    strictPort: true
  },
  preview: {
    port: previewPort,
    strictPort: true,
    // Bind on 0.0.0.0 so the platform's router can reach the container.
    host: true,
    // `vite preview` rejects unrecognized Host headers as DNS-rebinding
    // protection. A leading dot matches any subdomain, so this keeps
    // working if the Render service is ever renamed.
    allowedHosts: ['.onrender.com']
  }
})
