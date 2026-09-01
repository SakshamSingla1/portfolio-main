import { useMemo } from "react";
import { API_METHOD } from "../utils/constants";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

export const PROFILE_MASTER_URLS = {
  PROFILE_MASTER: "/profile-master",
};

// Memoized (empty deps) so the returned object/functions are referentially
// stable across renders — `get` has no closure over props/state, so it's
// safe to build once and keep it usable in dependency arrays without
// triggering re-runs every render.
export const useProfileMasterService = () => {
  return useMemo(() => {
    const get = () => {
      const url = replaceUrlParams(PROFILE_MASTER_URLS.PROFILE_MASTER, {});
      return request(API_METHOD.GET, url, null, null);
    };

    return { get };
  }, []);
};

export default useProfileMasterService;
