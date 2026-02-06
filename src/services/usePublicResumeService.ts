import { replaceUrlParams } from "../utils/helper";

export const PUBLIC_RESUME_URLS = {
  VIEW_RESUME: "/resume/view/:username",
  DOWNLOAD_RESUME: "/resume/download/:username",
};

export const usePublicResumeService = () => {

  const getViewResumeUrl = (username: string) =>
    `${import.meta.env.VITE_API_V1_URL}${replaceUrlParams(
      PUBLIC_RESUME_URLS.VIEW_RESUME,
      { username }
    )}`;

  const getDownloadResumeUrl = (username: string) =>
    `${import.meta.env.VITE_API_V1_URL}${replaceUrlParams(
      PUBLIC_RESUME_URLS.DOWNLOAD_RESUME,
      { username }
    )}`;

  return {
    getViewResumeUrl,
    getDownloadResumeUrl,
  };
};

export default usePublicResumeService;
