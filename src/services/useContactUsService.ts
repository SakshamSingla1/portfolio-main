import { API_METHOD } from "../utils/constants";
import { request } from ".";
import type { ContactUsRequest } from "../utils/types";

export const CONTACT_US_URLS = {
    CREATE: "/contact-us",
};

export const useContactUsService = () => {

    const create = (contactUs: ContactUsRequest) =>
        request(API_METHOD.POST, CONTACT_US_URLS.CREATE, null, contactUs);
    
    return {
        create,
    };
};

export default useContactUsService;
