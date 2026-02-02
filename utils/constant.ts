export const API_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export type ApiMethod = (typeof API_METHOD)[keyof typeof API_METHOD];
