import { useMemo } from "react";
import { API_METHOD } from "../utils/constants";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

export const PROFILE_MASTER_URLS = {
  PROFILE_MASTER: "/profile-master",
  VERIFY_ACCESS: "/profile-access/verify",
};

// Visitor-side access token for a PRIVATE profile (see ProfileAccessServiceImpl on the backend).
// sessionStorage is correctly scoped per-domain already -- every custom/subdomain portfolio is
// its own browser origin, so this never leaks across different profiles' domains.
const ACCESS_TOKEN_STORAGE_KEY = "profile_access_token";

export const getStoredProfileAccessToken = (): string | null => {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const storeProfileAccessToken = (token: string): void => {
  try {
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch {
    // Private-mode/quota -- the gate will just re-prompt next load, not fatal.
  }
};

// Memoized (empty deps) so the returned object/functions are referentially
// stable across renders — `get` has no closure over props/state, so it's
// safe to build once and keep it usable in dependency arrays without
// triggering re-runs every render.
export const useProfileMasterService = () => {
  return useMemo(() => {
    const get = () => {
      const url = replaceUrlParams(PROFILE_MASTER_URLS.PROFILE_MASTER, {});
      const token = getStoredProfileAccessToken();
      const headers = token ? { "X-Profile-Access-Token": token } : undefined;
      return request(API_METHOD.GET, url, null, null, null, undefined, undefined, headers);
    };

    const verifyAccess = (accessCode: string) => {
      const url = replaceUrlParams(PROFILE_MASTER_URLS.VERIFY_ACCESS, {});
      return request(API_METHOD.POST, url, null, { accessCode });
    };

    return { get, verifyAccess };
  }, []);
};

export default useProfileMasterService;
