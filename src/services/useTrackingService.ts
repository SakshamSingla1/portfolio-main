import axios from "axios";

// Derives the base BE URL by stripping "/public" from the public API URL
const BE_URL = (import.meta.env.VITE_API_V1_URL as string ?? "").replace(/\/public\/?$/, "");

const getSessionId = (): string => {
  const key = "_pv_sid";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = (typeof crypto?.randomUUID === "function")
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, sid);
  }
  return sid;
};

const getDevice = (): "MOBILE" | "TABLET" | "DESKTOP" => {
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk|(android(?!.*mobi))/.test(ua)) return "TABLET";
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/.test(ua)) return "MOBILE";
  return "DESKTOP";
};

export const trackPortfolioView = async (profileId: string): Promise<void> => {
  if (!profileId) return;

  // One track per session per profile — never spam the backend
  const seenKey = `_pv_${profileId}`;
  if (sessionStorage.getItem(seenKey)) return;

  try {
    await axios.post(`${BE_URL}/public/track-view`, {
      profileId,
      sessionId: getSessionId(),
      device: getDevice(),
      referrer: document.referrer ?? "",
      path: window.location.pathname,
    });
    sessionStorage.setItem(seenKey, "1");
  } catch {
    // Tracking must never break the portfolio — swallow all errors
  }
};
