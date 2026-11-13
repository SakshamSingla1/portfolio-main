import { useMemo } from "react";
import { request } from ".";
import { API_METHOD } from "../utils/constants";
import { replaceUrlParams } from "../utils/helper";

export interface LikeStatus {
  totalLikes: number;
  likedByVisitor: boolean;
}

export interface GuestbookEntry {
  id: number;
  visitorName: string;
  message: string;
  createdAt: string;
}

export interface GuestbookPage {
  content: GuestbookEntry[];
  totalElements: number;
  totalPages: number;
}

const ENGAGEMENT_URLS = {
  LIKE_STATUS: "/likes/:profileId",
  LIKE_TOGGLE: "/likes/:profileId/toggle",
  GUESTBOOK: "/guestbook/:profileId",
};

// Persisted in localStorage (not sessionStorage) so a "liked" state and the ability to toggle it
// back off survive across visits in the same browser, same as trackPortfolioView's session id
// pattern but intentionally longer-lived -- a like is meant to stick, a view-tracking session
// isn't.
const getVisitorId = (): string => {
  const key = "_pf_visitor_id";
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = (typeof crypto?.randomUUID === "function")
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    // Private mode/quota -- fall back to a per-load id; likes just won't persist as "liked".
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
};

export const useEngagementService = () => {
  return useMemo(() => {
    const getLikeStatus = (profileId: string | number) => {
      const url = replaceUrlParams(ENGAGEMENT_URLS.LIKE_STATUS, { profileId });
      return request(API_METHOD.GET, url, null, null, { params: { visitorId: getVisitorId() } });
    };

    const toggleLike = (profileId: string | number) => {
      const url = replaceUrlParams(ENGAGEMENT_URLS.LIKE_TOGGLE, { profileId });
      return request(API_METHOD.POST, url, null, null, { params: { visitorId: getVisitorId() } });
    };

    const getGuestbookEntries = (profileId: string | number, page = 0, size = 10) => {
      const url = replaceUrlParams(ENGAGEMENT_URLS.GUESTBOOK, { profileId });
      return request(API_METHOD.GET, url, null, null, { params: { page, size, sort: "createdAt,desc" } });
    };

    const addGuestbookEntry = (profileId: string | number, visitorName: string, message: string) => {
      const url = replaceUrlParams(ENGAGEMENT_URLS.GUESTBOOK, { profileId });
      return request(API_METHOD.POST, url, null, { visitorName, message });
    };

    return { getLikeStatus, toggleLike, getGuestbookEntries, addGuestbookEntry };
  }, []);
};

export default useEngagementService;
