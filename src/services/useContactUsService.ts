import { API_METHOD } from "../utils/constants";
import { request } from ".";

export const CONTACT_US_URLS = {
    CREATE: "/contact-us",
};

export interface ContactUs {
    id?: string;
    name: string;
    email: string;
    message: string;
    phone: string;
    createdAt: string;
}

export interface ContactUsRequest {
    name: string;
    email: string;
    message: string;
    phone: string;
    profileId: string | null;
}

export interface ContactUsFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useContactUsService = () => {

    const create = (contactUs: ContactUsRequest) =>
        request(API_METHOD.POST, CONTACT_US_URLS.CREATE, null, {contactUs, profileId: contactUs.profileId});
    
    return {
        create,
    };
};

export default useContactUsService;
