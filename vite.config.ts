import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';

/**
 * Hitting the base without its trailing slash (/hackathon-hub) falls outside the base and
 * lands on Vite's "public base URL" notice instead of the app. Static hosts redirect that
 * themselves; this makes the dev and preview servers behave the same way.
 */
function redirectBareBase(base: string): Plugin {
  const bare = base.replace(/\/+$/, '');
  const redirect = (req: any, res: any, next: () => void) => {
    if (bare && req.url === bare) {
      res.writeHead(301, {Location: base});
      res.end();
      return;
    }
    next();
  };
  return {
    name: 'redirect-bare-base',
    configureServer: server => void server.middlewares.use(redirect),
    configurePreviewServer: server => void server.middlewares.use(redirect),
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  // Served from the domain root by default, so routes read as /home and
  // /hackathon-hub/h/:id/dashboard. Set BASE_PATH to deploy under a subpath instead — the
  // rewrite in vercel.json has to be pointed at the same prefix. process.env comes first so
  // the CLI and Vercel's build env can override .env.
  const base = process.env.BASE_PATH || env.BASE_PATH || '/';

  return {
    base,
    plugins: [react(), tailwindcss(), redirectBareBase(base)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
