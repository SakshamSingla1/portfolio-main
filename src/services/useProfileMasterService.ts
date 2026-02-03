import { API_METHOD } from "../utils/constants";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

export const PROFILE_MASTER_URLS = {
  PROFILE_MASTER: "/profile-master",
};

export const useProfileMasterService = () => {
  const get = () => {
    const url = replaceUrlParams(PROFILE_MASTER_URLS.PROFILE_MASTER, {});
    return request(API_METHOD.GET, url, null, null);
  }

  return {
    get,
  };
};

export default useProfileMasterService;
