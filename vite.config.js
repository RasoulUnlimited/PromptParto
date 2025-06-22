import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
        input: 'index.html',
        output: {
          entryFileNames: 'js/[name].js',
          chunkFileNames: 'js/[name].js',
          assetFileNames: ({ name }) => {
            if (name && name.includes('fonts')) {
              return 'assets/fonts/[name][extname]';
            }
            if (name && name.endsWith('.css')) {
              return 'css/[name][extname]';
            }
            return 'assets/[name][extname]';
          }
        }
      }
    }
  });