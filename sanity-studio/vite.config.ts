import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    fs: {
      strict: false,
      allow: [
        // Only allow the sanity-studio directory
        process.cwd(),
        // Allow node_modules
        '/node_modules',
      ],
    },
  },
  optimizeDeps: {
    exclude: ['sanity'],
  },
})
