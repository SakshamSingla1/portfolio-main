import axios, { type AxiosError, type AxiosProgressEvent, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { type AuthenticatedUserType } from '../utils/types';

const API_BASE_URL = import.meta.env.VITE_API_V1_URL;

const setAuthHeader = (userContext: AuthenticatedUserType | null): void => {
  
    if (userContext?.token) {
    axios.defaults.headers.common['Authorization'] = userContext.token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

};

export const request = async (
  method: AxiosRequestConfig['method'],
  url: string,
  userContext: AuthenticatedUserType | null,
  data?: unknown,
  options?: { params: { [key: string]: unknown } } | null,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  baseUrl = API_BASE_URL,
  headers?: { [key: string]: string }
): Promise<AxiosResponse | null> => {


  setAuthHeader(userContext);

  try {
    const response = await axios({
      method,
      baseURL: baseUrl,
      url,
      data,
      ...(options ? options : {}),
      onUploadProgress,
      headers
    });
    return response;
  } catch (error) {
    return (error as AxiosError)?.response ?? null;
  }

}
