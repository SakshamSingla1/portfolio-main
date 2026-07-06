import axios from "axios";

const TRACK_URL = `${import.meta.env.VITE_API_V1_URL as string}/track-view`;

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

const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "Other";
};

const getOs = (): string => {
  const ua = navigator.userAgent;
  if (/Windows/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Mac OS X|macOS/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
};

export const trackPortfolioView = async (profileId: string): Promise<void> => {
  if (!profileId) return;

  const seenKey = `_pv_${profileId}`;
  if (sessionStorage.getItem(seenKey)) return;

  try {
    await axios.post(TRACK_URL, {
      profileId,
      sessionId: getSessionId(),
      device: getDevice(),
      referrer: document.referrer ?? "",
      path: window.location.pathname,
      browser: getBrowser(),
      os: getOs(),
      language: navigator.language ?? "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    });
    sessionStorage.setItem(seenKey, "1");
  } catch {
    // Tracking must never break the portfolio — swallow all errors
  }
};
