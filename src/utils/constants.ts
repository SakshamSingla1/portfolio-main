import type { Option } from "./types";

export const API_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const SocialLinkPlatform = {
    GITHUB: "GITHUB",
    GITLAB: "GITLAB",   
    BITBUCKET: "BITBUCKET",
    LINKEDIN: "LINKEDIN",
    STACKOVERFLOW: "STACKOVERFLOW",
    LEETCODE: "LEETCODE",
    HACKERRANK: "HACKERRANK",
    CODECHEF: "CODECHEF",
    CODEFORCES: "CODEFORCES",
    PORTFOLIO: "PORTFOLIO",
    RESUME: "RESUME",
    TWITTER: "TWITTER",
    X: "X",
    INSTAGRAM: "INSTAGRAM",
    FACEBOOK: "FACEBOOK",
    OTHER: "OTHER"
} as const;

export const DEGREE_OPTIONS: Option[] = [
  { value: 'HIGH_SCHOOL', label: '10th' },
  { value: 'SENIOR_SECONDARY', label: '12th' },
  { value: 'DIPLOMA', label: 'Diploma' },
  { value: 'ADVANCED_DIPLOMA', label: 'Advanced Diploma' },
  { value: 'CERTIFICATION', label: 'Certification' },
  { value: 'ASSOCIATE', label: 'Associate Degree' },
  { value: 'BACHELORS', label: 'Bachelors' },
  { value: 'BTECH', label: 'Bachelor of Technology (B.Tech)' },
  { value: 'BE', label: 'Bachelor of Engineering (B.E.)' },
  { value: 'BSC', label: 'Bachelor of Science (B.Sc)' },
  { value: 'BA', label: 'Bachelor of Arts (B.A)' },
  { value: 'BCOM', label: 'Bachelor of Commerce (B.Com)' },
  { value: 'BCA', label: 'Bachelor of Computer Applications (BCA)' },
  { value: 'BBA', label: 'Bachelor of Business Administration (BBA)' },
  { value: 'MASTERS', label: 'Masters' },
  { value: 'MTECH', label: 'Master of Technology (M.Tech)' },
  { value: 'ME', label: 'Master of Engineering (M.E.)' },
  { value: 'MSC', label: 'Master of Science (M.Sc)' },
  { value: 'MA', label: 'Master of Arts (M.A)' },
  { value: 'MCOM', label: 'Master of Commerce (M.Com)' },
  { value: 'MBA', label: 'Master of Business Administration (MBA)' },
  { value: 'MCA', label: 'Master of Computer Applications (MCA)' },
  { value: 'PHD', label: 'PhD' },
  { value: 'POST_DOCTORATE', label: 'Post Doctorate' },
  { value: 'OTHER', label: 'Other' },
];