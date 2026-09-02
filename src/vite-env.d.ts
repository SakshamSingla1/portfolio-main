/// <reference types="vite/client" />

import type { ProfileMaster } from "./utils/types";

interface ImportMetaEnv {
  readonly VITE_API_V1_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    /** Set by middleware.ts (Vercel Edge Middleware) when it successfully
     * embeds this domain's profile data server-side. See Index.tsx. */
    __INITIAL_PROFILE_DATA__?: ProfileMaster;
  }
}
