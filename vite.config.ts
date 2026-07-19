import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'FounderOS',
        short_name: 'FounderOS',
        description: 'Startup Management & Learning Pipeline',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
