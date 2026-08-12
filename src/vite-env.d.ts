/// <reference types="vite/client" />

/**
 * Only variables prefixed VITE_ are exposed to the browser bundle. Declaring them here means a
 * typo in `import.meta.env.VITE_…` is a type error rather than a silent `undefined` at runtime.
 */
interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://abcdefgh.supabase.co */
  readonly VITE_SUPABASE_URL?: string;
  /**
   * Supabase anon (publishable) key. Safe to ship in the bundle — it grants nothing on its own
   * because every table is behind row level security. Never put the service-role key here.
   */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
