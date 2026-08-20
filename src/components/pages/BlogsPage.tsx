import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FiArrowLeft, FiSearch, FiClock, FiEye, FiCalendar,
  FiArrowRight, FiHash, FiBookOpen, FiLoader,
} from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { usePublicBlogService, type BlogPostSummary, type BlogTag } from "../../services/usePublicBlogService";
import useProfileMasterService from "../../services/useProfileMasterService";
import { getOptimizedImageUrl } from "../../utils/helper";
import { HTTP_STATUS } from "../../utils/constants";
import GridBackground from "../molecules/GridBackground/GridBackground";
import FadeInView from "../molecules/FadeInView/FadeInView";

const getUsername = (): string | null => {
  try {
    const raw = localStorage.getItem("portfolio_data");
    if (!raw) return null;
    return JSON.parse(raw)?.profile?.userName ?? null;
  } catch {
    return null;
  }
};

const getProfileMeta = (): { name: string; userName: string; logoUrl?: string } | null => {
  try {
    const raw = localStorage.getItem("portfolio_data");
    if (!raw) return null;
    const p = JSON.parse(raw)?.profile;
    return p ? { name: p.fullName, userName: p.userName, logoUrl: p.logoUrl } : null;
  } catch {
    return null;
  }
};

const formatPublishedDate = (iso: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
};

const BlogCard = ({
  post,
  idx,
  colors,
}: {
  post: BlogPostSummary;
  idx: number;
  colors: ReturnType<typeof useColors>;
}) => {
  const [hovered, setHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const g = gradients(colors);

  return (
    <FadeInView delay={idx * 0.08}>
      <motion.article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-2xl overflow-hidden flex flex-col h-full group"
        style={{
          background: `linear-gradient(135deg, ${colors.neutral800}70, ${colors.neutral900}90)`,
          border: `1px solid ${hovered ? `${colors.primary500}40` : `${colors.neutral700}30`}`,
          boxShadow: hovered
            ? `0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 60px -15px ${colors.primary500}25, 0 8px 24px -8px ${colors.accent500}15`
            : `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -28px rgba(0,0,0,0.7)`,
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        <div className="relative overflow-hidden" style={{ height: 200 }}>
          {post.coverImageUrl && !imgFailed ? (
            <motion.img
              src={getOptimizedImageUrl(post.coverImageUrl, { width: 800 })}
              alt={post.title}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary900}60, ${colors.accent900}40)` }}
            >
              <FiBookOpen size={40} style={{ color: `${colors.primary400}60` }} />
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${colors.neutral900}CC 0%, transparent 60%)`,
            }}
          />

          {post.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md"
                  style={{
                    background: `${colors.primary500}30`,
                    color: colors.primary300,
                    border: `1px solid ${colors.primary500}40`,
                  }}
                >
                  <FiHash size={8} />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center gap-3 mb-3">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: colors.neutral500 }}>
                <FiCalendar size={10} />
                {formatPublishedDate(post.publishedAt)}
              </span>
            )}
            {post.readTimeMins && (
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: colors.neutral500 }}>
                <FiClock size={10} />
                {post.readTimeMins} min read
              </span>
            )}
            {post.viewCount > 0 && (
              <span className="flex items-center gap-1.5 text-[11px] ml-auto" style={{ color: colors.neutral600 }}>
                <FiEye size={10} />
                {post.viewCount >= 1000 ? `${(post.viewCount / 1000).toFixed(1)}k` : post.viewCount}
              </span>
            )}
          </div>

          <h2
            className="font-bold text-base leading-snug mb-2 line-clamp-2"
            style={{ color: colors.neutral100 }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p
              className="text-sm leading-relaxed line-clamp-3 flex-1"
              style={{ color: `${colors.neutral400}CC` }}
            >
              {post.excerpt}
            </p>
          )}

          <Link
            to={`/blogs/${post.slug}`}
            className="flex items-center gap-2 mt-4 text-sm font-semibold self-start group/link"
            style={{ color: colors.primary400 }}
          >
            <span>Read post</span>
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiArrowRight size={14} />
            </motion.span>
          </Link>
        </div>

        <motion.div
          className="h-px mx-5 mb-0"
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: g.ctaGradient, transformOrigin: "left" }}
        />
      </motion.article>
    </FadeInView>
  );
};

const BlogsPage = () => {
  const colors = useColors();
  const g = gradients(colors);
  const blogService = usePublicBlogService();
  const profileService = useProfileMasterService();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("search") || "");
  const [username, setUsername] = useState<string | null>(getUsername());
  const [profileMeta, setProfileMeta] = useState(getProfileMeta());
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 0);
  const [tags, setTags] = useState<BlogTag[]>([]);
  // Only the id is persisted (state + URL) — the display object is derived
  // once `tags` loads, so a page refresh doesn't need the tag list to have
  // already arrived before it can restore the selection.
  const [activeTagId, setActiveTagId] = useState<number | null>(() => {
    const raw = searchParams.get("tagId");
    return raw ? Number(raw) : null;
  });
  const activeTag = tags.find((t) => t.id === activeTagId) ?? null;

  // Resolve username from cache or API
  useEffect(() => {
    if (username) return;
    profileService.get().then((res) => {
      if (res?.status === HTTP_STATUS.OK) {
        const profile = res.data?.data?.profile;
        if (profile?.userName) {
          setUsername(profile.userName);
          setProfileMeta({ name: profile.fullName, userName: profile.userName, logoUrl: profile.logoUrl });
        }
      }
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Tags come from the profile's full published set, independent of the
  // current page/filter — so the chip row doesn't shrink to whatever tags
  // happen to appear on the currently-filtered page.
  useEffect(() => {
    if (!username) return;
    blogService.getTags(username).then((res) => {
      if (res?.status === HTTP_STATUS.OK) {
        setTags(res.data?.data ?? []);
      }
    });
  }, [username]);

  const fetchPosts = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await blogService.getPosts(username, {
        page,
        size: 9,
        sortBy: "publishedAt",
        sortDir: "desc",
        search: debouncedSearch || undefined,
        tagId: activeTagId ?? undefined,
      });
      if (res?.status === HTTP_STATUS.OK) {
        const data = res.data?.data;
        setPosts(data?.content ?? []);
        setTotalPages(data?.totalPages ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [username, page, debouncedSearch, activeTagId]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Keeps the URL a shareable/bookmarkable/back-button-safe representation
  // of the current filters, matching the pattern every admin listing page
  // already uses — this page was the one spot in the app missing it.
  useEffect(() => {
    const params: Record<string, string> = { page: page.toString() };
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeTagId !== null) params.tagId = activeTagId.toString();
    setSearchParams(params, { replace: true });
  }, [page, debouncedSearch, activeTagId, setSearchParams]);

  const handleSelectTag = (tag: BlogTag | null) => {
    setActiveTagId(tag?.id ?? null);
    setPage(0);
  };

  return (
    <div className="min-h-screen relative" style={{ background: colors.neutral900, color: colors.neutral100 }}>
      <Helmet>
        <title>Blog{profileMeta?.name ? ` — ${profileMeta.name}` : ""}</title>
        <meta name="description" content={`Articles and thoughts by ${profileMeta?.name ?? "the author"}`} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Blog${profileMeta?.name ? ` — ${profileMeta.name}` : ""}`} />
        <meta property="og:description" content={`Articles and thoughts by ${profileMeta?.name ?? "the author"}`} />
        {profileMeta?.logoUrl && <meta property="og:image" content={profileMeta.logoUrl} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Blog${profileMeta?.name ? ` — ${profileMeta.name}` : ""}`} />
        <meta name="twitter:description" content={`Articles and thoughts by ${profileMeta?.name ?? "the author"}`} />
        {profileMeta?.logoUrl && <meta name="twitter:image" content={profileMeta.logoUrl} />}
      </Helmet>

      <GridBackground />

      <div className="relative z-10">
        <div
          className="sticky top-0 z-40 backdrop-blur-md"
          style={{ background: `${colors.neutral900}CC`, borderBottom: `1px solid ${colors.neutral800}60` }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
              style={{ color: colors.neutral400 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary400)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.neutral400)}
            >
              <FiArrowLeft size={16} />
              Back to Portfolio
            </button>

            <div
              className="font-bold text-base"
              style={{ color: colors.neutral200 }}
            >
              <span style={{ color: colors.primary500 }}>{"<"}</span>
              {profileMeta?.userName ?? "blog"}
              <span style={{ color: colors.primary500 }}>{" />"}</span>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="text-[11px] font-mono uppercase tracking-[0.4em] block mb-3"
                style={{ color: `${colors.primary400}90` }}
              >
                {"// blog"}
              </span>
              <h1
                className="font-bold text-4xl sm:text-5xl bg-clip-text text-transparent mb-4"
                style={{ backgroundImage: g.heroGradient }}
              >
                Articles & Thoughts
              </h1>
              <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: `${colors.neutral400}CC` }}>
                Writing about software, engineering, and ideas worth sharing.
              </p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mx-auto mt-6 relative"
              style={{ width: 80, height: 3 }}
            >
              <div className="absolute inset-0 rounded-full" style={{ background: g.ctaGradient }} />
              <div className="absolute inset-0 rounded-full" style={{ background: g.ctaGradient, filter: "blur(6px)", opacity: 0.6 }} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-10 max-w-md mx-auto relative"
          >
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              size={15}
              style={{ color: colors.neutral500 }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: `${colors.neutral800}60`,
                border: `1px solid ${colors.neutral700}50`,
                color: colors.neutral200,
                backdropFilter: "blur(8px)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.primary500}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = `${colors.neutral700}50`)}
            />
          </motion.div>

          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-10 -mt-4"
            >
              <button
                onClick={() => handleSelectTag(null)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  background: !activeTag ? `${colors.primary500}20` : `${colors.neutral800}50`,
                  color: !activeTag ? colors.primary300 : colors.neutral400,
                  border: `1px solid ${!activeTag ? `${colors.primary500}40` : `${colors.neutral700}40`}`,
                }}
              >
                All posts
              </button>
              {tags.map((tag) => {
                const isActive = activeTag?.id === tag.id;
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleSelectTag(tag)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                    style={{
                      background: isActive ? `${colors.primary500}20` : `${colors.neutral800}50`,
                      color: isActive ? colors.primary300 : colors.neutral400,
                      border: `1px solid ${isActive ? `${colors.primary500}40` : `${colors.neutral700}40`}`,
                    }}
                  >
                    <FiHash size={9} />
                    {tag.name}
                  </button>
                );
              })}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-24"
              >
                <div
                  className="w-10 h-10 rounded-full animate-spin"
                  style={{ border: `3px solid ${colors.primary500}`, borderTopColor: "transparent" }}
                />
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <FiLoader size={32} className="mx-auto mb-4 opacity-30" style={{ color: colors.neutral500 }} />
                <p className="text-sm" style={{ color: colors.neutral500 }}>
                  {debouncedSearch
                    ? `No posts matching "${debouncedSearch}"`
                    : activeTag
                    ? `No posts tagged "${activeTag.name}"`
                    : "No posts published yet."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {posts.map((post, idx) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    idx={idx}
                    colors={colors}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 mt-12"
            >
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                style={{
                  background: `${colors.neutral800}60`,
                  border: `1px solid ${colors.neutral700}50`,
                  color: colors.neutral300,
                }}
              >
                ← Prev
              </button>
              <span className="text-sm px-3" style={{ color: colors.neutral500 }}>
                {page + 1} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                style={{
                  background: `${colors.neutral800}60`,
                  border: `1px solid ${colors.neutral700}50`,
                  color: colors.neutral300,
                }}
              >
                Next →
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BlogsPage;
