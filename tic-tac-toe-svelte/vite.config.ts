import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte()],

    define: {
        'import.meta.env.OAUTH_GOOGLE_CLIENT_ID': JSON.stringify(''),
    },
})
