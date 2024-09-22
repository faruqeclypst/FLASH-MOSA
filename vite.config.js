import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    server: {
        host: true, // Mengizinkan akses dari semua network interfaces
        port: 3000, // Port yang akan digunakan (opsional, default adalah 5173)
        strictPort: true, // Gunakan port yang ditentukan atau hentikan jika port sudah digunakan
        open: false, // Jangan buka browser secara otomatis
    }
});
