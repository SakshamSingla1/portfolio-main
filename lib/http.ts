import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_V1_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const request = async <T = any>(
    method: AxiosRequestConfig["method"],
    url: string,
    data?: any,
    options?: AxiosRequestConfig,
    onUploadProgress?: AxiosRequestConfig["onUploadProgress"],
    baseUrl: string = API_BASE_URL!,
    headers?: Record<string, string>
): Promise<T | null> => {
    try {
        const response = await api({
            method,
            url,
            baseURL: baseUrl,
            data,
            onUploadProgress,
            headers,
            ...options,
        });

        return response.data as T;
    } catch (error) {
        const err = error as AxiosError;
        if (err.response?.data) {
            return err.response.data as T;
        }
        return null;
    }
};
