import { useMemo } from "react";
import { API_METHOD } from "../utils/constants";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

const BLOG_URLS = {
  LIST:   "/blog/:username",
  TAGS:   "/blog/:username/tags",
  DETAIL: "/blog/:username/:slug",
};

export interface BlogTag {
  id: number;
  name: string;
}

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  publishedAt: string | null;
  viewCount: number;
  readTimeMins: number | null;
  coverImageUrl: string | null;
  tags: BlogTag[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  profileId: number;
  content: string | null;
}

export interface BlogListParams {
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  [key: string]: unknown;
}

// Memoized (empty deps) so the returned object/functions are referentially
// stable across renders — none of them close over props/state, so it's
// safe to build once and keep the result usable in dependency arrays
// without triggering re-runs every render.
export const usePublicBlogService = () => {
  return useMemo(() => {
    const getPosts = (username: string, params?: BlogListParams) =>
      request(API_METHOD.GET, replaceUrlParams(BLOG_URLS.LIST, { username }), null, null, params ? { params } : null);

    const getTags = (username: string) =>
      request(API_METHOD.GET, replaceUrlParams(BLOG_URLS.TAGS, { username }), null, null);

    const getPost = (username: string, slug: string) =>
      request(API_METHOD.GET, replaceUrlParams(BLOG_URLS.DETAIL, { username, slug }), null, null);

    return { getPosts, getTags, getPost };
  }, []);
};

export default usePublicBlogService;
