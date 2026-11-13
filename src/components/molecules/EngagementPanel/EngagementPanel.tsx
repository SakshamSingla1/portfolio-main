import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useColors } from "../../../utils/theme";
import { HTTP_STATUS } from "../../../utils/constants";
import useEngagementService, { type GuestbookEntry, type LikeStatus } from "../../../services/useEngagementService";

interface EngagementPanelProps {
  profileId: string | number;
}

// Mounted once in Index.tsx (after whichever template renders) rather than inside each of the 7
// portfolio templates individually -- this keeps like/guestbook behavior identical across every
// template without touching all seven, at the cost of always appearing as a trailing section
// rather than being laid out by each template's own design.
const EngagementPanel: React.FC<EngagementPanelProps> = ({ profileId }) => {
  const colors = useColors();
  const engagementService = useEngagementService();

  const [likeStatus, setLikeStatus] = useState<LikeStatus | null>(null);
  const [likeBusy, setLikeBusy] = useState(false);

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [visitorName, setVisitorName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    engagementService.getLikeStatus(profileId).then((res) => {
      if (res?.status === HTTP_STATUS.OK) setLikeStatus(res.data?.data ?? null);
    });
    engagementService.getGuestbookEntries(profileId).then((res) => {
      if (res?.status === HTTP_STATUS.OK) setEntries(res.data?.data?.content ?? []);
      setEntriesLoading(false);
    });
    // profileId is the only input that should ever re-trigger this; engagementService is a
    // memoized, referentially-stable hook result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const handleToggleLike = async () => {
    if (!profileId || likeBusy) return;
    setLikeBusy(true);
    // Optimistic update -- a like toggle should feel instant; reconciled below regardless.
    setLikeStatus((prev) => prev && {
      totalLikes: prev.likedByVisitor ? prev.totalLikes - 1 : prev.totalLikes + 1,
      likedByVisitor: !prev.likedByVisitor,
    });
    try {
      const res = await engagementService.toggleLike(profileId);
      if (res?.status === HTTP_STATUS.OK) {
        setLikeStatus(res.data?.data ?? null);
      }
    } finally {
      setLikeBusy(false);
    }
  };

  const handleSubmitGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId || submitting) return;
    if (!visitorName.trim() || !message.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await engagementService.addGuestbookEntry(profileId, visitorName.trim(), message.trim());
      if (res?.status === HTTP_STATUS.OK) {
        const newEntry = res.data?.data as GuestbookEntry;
        setEntries((prev) => [newEntry, ...prev]);
        setVisitorName("");
        setMessage("");
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else if (res?.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
        setSubmitError("Too many messages sent recently -- please try again later.");
      } else {
        setSubmitError("Couldn't post your message. Please try again.");
      }
    } catch {
      setSubmitError("Couldn't post your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!profileId) return null;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-center mb-8">
        <button
          onClick={handleToggleLike}
          disabled={!likeStatus}
          aria-pressed={likeStatus?.likedByVisitor ?? false}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 transition-transform active:scale-95"
          style={{
            background: likeStatus?.likedByVisitor ? `${colors.primary500}1a` : colors.neutral100,
            border: `1px solid ${likeStatus?.likedByVisitor ? colors.primary500 : colors.neutral200}`,
            cursor: likeStatus ? "pointer" : "default",
          }}
        >
          <Heart
            size={18}
            fill={likeStatus?.likedByVisitor ? colors.primary500 : "none"}
            stroke={likeStatus?.likedByVisitor ? colors.primary500 : colors.neutral500}
          />
          <span className="text-sm font-semibold" style={{ color: colors.neutral700 }}>
            {likeStatus ? likeStatus.totalLikes : "–"} {likeStatus?.totalLikes === 1 ? "Like" : "Likes"}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={18} style={{ color: colors.primary500 }} />
        <h2 className="text-base font-semibold" style={{ color: colors.neutral800 }}>
          Guestbook
        </h2>
      </div>

      <form onSubmit={handleSubmitGuestbook} className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          disabled={submitting}
          className="w-full text-sm rounded-lg px-3 py-2 outline-none"
          style={{ border: `1px solid ${colors.neutral200}`, color: colors.neutral800 }}
        />
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message..."
            maxLength={500}
            rows={2}
            disabled={submitting}
            className="flex-1 text-sm rounded-lg px-3 py-2 outline-none resize-none"
            style={{ border: `1px solid ${colors.neutral200}`, color: colors.neutral800 }}
          />
          <button
            type="submit"
            disabled={submitting || !visitorName.trim() || !message.trim()}
            className="flex items-center justify-center rounded-lg px-4"
            style={{
              background: colors.primary500,
              color: "#ffffff",
              opacity: submitting || !visitorName.trim() || !message.trim() ? 0.5 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
            aria-label="Post message"
          >
            <Send size={16} />
          </button>
        </div>
        {submitError && <p className="text-xs" style={{ color: "#ef4444" }}>{submitError}</p>}
        {submitSuccess && <p className="text-xs" style={{ color: colors.primary500 }}>Message posted!</p>}
      </form>

      <div className="flex flex-col gap-3">
        {entriesLoading && (
          <p className="text-sm" style={{ color: colors.neutral500 }}>Loading messages…</p>
        )}
        {!entriesLoading && entries.length === 0 && (
          <p className="text-sm" style={{ color: colors.neutral500 }}>No messages yet -- be the first to say hello!</p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl p-3"
            style={{ background: colors.neutral50, border: `1px solid ${colors.neutral100}` }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold" style={{ color: colors.neutral800 }}>{entry.visitorName}</p>
              <p className="text-xs" style={{ color: colors.neutral500 }}>
                {new Date(entry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <p className="text-sm mt-1" style={{ color: colors.neutral600 }}>{entry.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EngagementPanel;
