
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   base: '/responsive_nav_menu_strapi/',
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:1337',
//         changeOrigin: true,
//         secure: true,
//       }
//     }
//   }
// })

export default defineConfig({
  plugins: [react()],
  base: '/responsive_nav_menu_strapi/',
  server: {
    proxy: {
      '/api': {
        target: 'https://loved-rhythm-7c69d3a485.strapiapp.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})



// https://vite.dev/config/
// export default defineConfig({
//   base: '/responsive_nav_menu_strapi/',
//   plugins: [react()],
// })