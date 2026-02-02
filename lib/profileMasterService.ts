import { request } from "./http";
import { API_METHOD } from "@/utils/constant";

export const PROFILE_MASTER_URL = {
    GET: "/profile-master",
};


export async function getProfileMaster() {
    const get = () => {
        const url = PROFILE_MASTER_URL.GET;
        return request<any>(API_METHOD.GET, url, null);
    };

    return get();
}