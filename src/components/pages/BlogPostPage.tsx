import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DOMPurify from 'dompurify';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FiArrowLeft, FiClock, FiEye, FiCalendar, FiHash,
  FiShare2, FiChevronRight,
} from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { usePublicBlogService, type BlogPostDetail } from "../../services/usePublicBlogService";
import useProfileMasterService from "../../services/useProfileMasterService";
import { getOptimizedImageUrl } from "../../utils/helper";
import { HTTP_STATUS } from "../../utils/constants";
import GridBackground from "../molecules/GridBackground/GridBackground";

const getUsername = (): string | null => {
  try {
    const raw = localStorage.getItem("portfolio_data");
    if (!raw) return null;
    return JSON.parse(raw)?.profile?.userName ?? null;
  } catch { return null; }
};

const getProfileMeta = () => {
  try {
    const raw = localStorage.getItem("portfolio_data");
    if (!raw) return null;
    const p = JSON.parse(raw)?.profile;
    return p ? { name: p.fullName, userName: p.userName, logoUrl: p.logoUrl } : null;
  } catch { return null; }
};

const formatLong = (iso: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
};

const PROSE_STYLES = `
  .blog-prose { font-family: inherit; line-height: 1.8; }
  .blog-prose h1,.blog-prose h2,.blog-prose h3,.blog-prose h4 { font-weight: 700; margin: 1.75em 0 0.75em; line-height: 1.3; color: var(--prose-headings); }
  .blog-prose h1 { font-size: 1.75rem; }
  .blog-prose h2 { font-size: 1.375rem; }
  .blog-prose h3 { font-size: 1.125rem; }
  .blog-prose h4 { font-size: 1rem; }
  .blog-prose p  { margin: 1em 0; }
  .blog-prose ul,.blog-prose ol { margin: 1em 0 1em 1.5rem; }
  .blog-prose ul { list-style: disc; }
  .blog-prose ol { list-style: decimal; }
  .blog-prose li { margin: 0.35em 0; }
  .blog-prose a  { color: var(--prose-link); text-decoration: underline; text-underline-offset: 2px; }
  .blog-prose a:hover { opacity: 0.8; }
  .blog-prose blockquote { margin: 1.5em 0; padding: 0.75em 1.25em; border-radius: 0 8px 8px 0; font-style: italic; background: var(--prose-blockquote-bg); border-left: 3px solid var(--prose-blockquote-border); }
  .blog-prose pre { margin: 1.5em 0; padding: 1.25em; border-radius: 10px; overflow-x: auto; font-size: 0.875rem; line-height: 1.6; background: var(--prose-pre-bg) !important; }
  .blog-prose code { font-family: "SF Mono","Fira Code",Consolas,monospace; font-size: 0.875em; padding: 0.15em 0.4em; border-radius: 4px; background: var(--prose-code-bg); }
  .blog-prose pre code { padding: 0; background: transparent; }
  .blog-prose hr { margin: 2.5em 0; border: none; height: 1px; background: var(--prose-hr); }
  .blog-prose img { max-width: 100%; border-radius: 10px; margin: 1.5em 0; }
  .blog-prose table { width: 100%; border-collapse: collapse; margin: 1.5em 0; overflow-x: auto; display: block; }
  .blog-prose th,.blog-prose td { padding: 0.6em 1em; border: 1px solid var(--prose-td-border); text-align: left; }
  .blog-prose th { font-weight: 700; background: var(--prose-th-bg); }
  .blog-prose strong { font-weight: 700; }
  .blog-prose em { font-style: italic; }
`;

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const colors = useColors();
  const g = gradients(colors);
  const blogService = usePublicBlogService();
  const profileService = useProfileMasterService();

  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [username, setUsername] = useState<string | null>(getUsername());
  const [profileMeta, setProfileMeta] = useState(getProfileMeta());
  const [copied, setCopied] = useState(false);

  // Resolve username
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

  // Fetch post once username is known
  useEffect(() => {
    if (!username || !slug) return;
    setLoading(true);
    blogService.getPost(username, slug).then((res) => {
      if (res?.status === HTTP_STATUS.OK) {
        setPost(res.data?.data ?? null);
      } else {
        setNotFound(true);
      }
    }).catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username, slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.neutral900 }}>
        <div className="w-10 h-10 rounded-full animate-spin"
          style={{ border: `3px solid ${colors.primary500}`, borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: colors.neutral900, color: colors.neutral100 }}>
        <p className="text-6xl font-bold" style={{ color: colors.primary500 }}>404</p>
        <p className="text-sm" style={{ color: colors.neutral500 }}>Post not found</p>
        <Link to="/blogs" className="text-sm underline" style={{ color: colors.primary400 }}>← Back to Blog</Link>
      </div>
    );
  }

  const seoTitle = `${post.title}${profileMeta?.name ? ` — ${profileMeta.name}` : ""}`;
  const seoDesc = post.excerpt ?? post.title;

  return (
    <div className="min-h-screen relative" style={{ background: colors.neutral900, color: colors.neutral100 }}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        {post.coverImageUrl && <meta property="og:image" content={post.coverImageUrl} />}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="article" />
        {post.publishedAt && <meta property="article:published_time" content={post.publishedAt} />}
        {post.tags.map((t) => <meta key={t.id} property="article:tag" content={t.name} />)}
      </Helmet>

      <style>{PROSE_STYLES}</style>
      <GridBackground />

      <div className="relative z-10">
        {/* Sticky top bar */}
        <div
          className="sticky top-0 z-40 backdrop-blur-md"
          style={{ background: `${colors.neutral900}CC`, borderBottom: `1px solid ${colors.neutral800}60` }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm" style={{ color: colors.neutral500 }}>
              <button
                onClick={() => navigate("/blogs")}
                className="hover:text-current transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary400)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.neutral500)}
              >
                Blog
              </button>
              <FiChevronRight size={13} />
              <span
                className="max-w-[180px] sm:max-w-xs truncate"
                style={{ color: colors.neutral300 }}
              >
                {post.title}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: copied ? `${colors.success500}20` : `${colors.neutral800}80`,
                  border: `1px solid ${copied ? `${colors.success500}40` : `${colors.neutral700}50`}`,
                  color: copied ? colors.success400 : colors.neutral400,
                }}
              >
                <FiShare2 size={12} />
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
          {/* Cover image */}
          {post.coverImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl mt-8 mb-10"
              style={{ height: 340 }}
            >
              <img
                src={getOptimizedImageUrl(post.coverImageUrl, { width: 1200 })}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to top, ${colors.neutral900}BB 0%, transparent 50%)` }}
              />
            </motion.div>
          )}

          {/* Article header */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={post.coverImageUrl ? "" : "mt-12"}
          >
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                      background: `${colors.primary500}18`,
                      color: colors.primary400,
                      border: `1px solid ${colors.primary500}30`,
                    }}
                  >
                    <FiHash size={9} />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="font-bold text-2xl sm:text-3xl md:text-4xl leading-tight mb-5"
              style={{ color: colors.neutral50 }}
            >
              {post.title}
            </h1>

            {/* Meta row */}
            <div
              className="flex flex-wrap items-center gap-4 pb-6 mb-8"
              style={{ borderBottom: `1px solid ${colors.neutral800}` }}
            >
              <div className="flex items-center gap-2">
                {profileMeta?.logoUrl ? (
                  <img
                    src={profileMeta.logoUrl}
                    alt={profileMeta.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: g.ctaGradient }}
                  >
                    {profileMeta?.name?.charAt(0) ?? "A"}
                  </div>
                )}
                <span className="text-sm font-medium" style={{ color: colors.neutral300 }}>
                  {profileMeta?.name ?? "Author"}
                </span>
              </div>

              <div className="w-px h-4" style={{ background: colors.neutral700 }} />

              {post.publishedAt && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: colors.neutral500 }}>
                  <FiCalendar size={12} />
                  {formatLong(post.publishedAt)}
                </span>
              )}

              {post.readTimeMins && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: colors.neutral500 }}>
                  <FiClock size={12} />
                  {post.readTimeMins} min read
                </span>
              )}

              {post.viewCount > 0 && (
                <span className="flex items-center gap-1.5 text-sm ml-auto" style={{ color: colors.neutral600 }}>
                  <FiEye size={12} />
                  {post.viewCount >= 1000 ? `${(post.viewCount / 1000).toFixed(1)}k` : post.viewCount} views
                </span>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p
                className="text-base italic mb-8 pl-4"
                style={{
                  color: `${colors.neutral400}CC`,
                  borderLeft: `3px solid ${colors.primary500}50`,
                }}
              >
                {post.excerpt}
              </p>
            )}
          </motion.header>

          {/* Article content */}
          {post.content && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="blog-prose"
              style={{
                color: colors.neutral300,
                "--prose-headings": colors.neutral100,
                "--prose-link": colors.primary400,
                "--prose-code-bg": `${colors.neutral800}`,
                "--prose-blockquote-bg": `${colors.neutral800}60`,
                "--prose-blockquote-border": colors.primary500,
                "--prose-hr": colors.neutral800,
                "--prose-pre-bg": `${colors.neutral800}`,
                "--prose-th-bg": `${colors.neutral800}`,
                "--prose-td-border": `${colors.neutral700}`,
              } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content ?? '') }}
            />
          )}

          {/* Bottom: tags + back link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ borderTop: `1px solid ${colors.neutral800}` }}
          >
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: `${colors.neutral800}80`,
                      color: colors.neutral400,
                      border: `1px solid ${colors.neutral700}50`,
                    }}
                  >
                    <FiHash size={9} />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <Link
              to="/blogs"
              className="flex items-center gap-2 text-sm font-medium shrink-0 transition-colors"
              style={{ color: colors.primary400 }}
            >
              <FiArrowLeft size={14} />
              All Posts
            </Link>
          </motion.div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
