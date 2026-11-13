import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiSend, FiMessageSquare } from "react-icons/fi";
import { request } from "../../services";
import { API_METHOD, HTTP_STATUS } from "../../utils/constants";
import { useColors } from "../../utils/theme";

interface ContactMessage {
  id: number;
  senderType: "VISITOR" | "OWNER";
  message: string;
  createdAt: string;
}

interface ContactThread {
  contactUsId: number;
  visitorName: string;
  profileName: string;
  messages: ContactMessage[];
}

type PageState = "loading" | "thread" | "error";

// Reached from the "Continue the Conversation" link in the CONTACT-REPLY email (see portfolio-be's
// ContactUsServiceImpl#reply) -- lets the original visitor read every reply and send another
// message without needing an account, the same token-link pattern TestimonialSubmitPage uses.
const ContactThreadPage = () => {
  const { token } = useParams<{ token: string }>();
  const colors = useColors();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [thread, setThread] = useState<ContactThread | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid link.");
      setPageState("error");
      return;
    }
    request(API_METHOD.GET, `/contact-thread/${token}`, null)
      .then((res) => {
        if (res?.status === HTTP_STATUS.OK) {
          setThread(res.data?.data ?? null);
          setPageState("thread");
        } else {
          setErrorMessage("This conversation link is invalid or no longer exists.");
          setPageState("error");
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong. Please try again later.");
        setPageState("error");
      });
  }, [token]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !replyText.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await request(API_METHOD.POST, `/contact-thread/${token}/reply`, null, { message: replyText.trim() });
      if (res?.status === HTTP_STATUS.OK && res.data?.data) {
        setThread((prev) => prev && { ...prev, messages: [...prev.messages, res.data.data] });
        setReplyText("");
      } else if (res?.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
        setSubmitError("Too many messages sent recently -- please try again later.");
      } else {
        setSubmitError("Couldn't send your reply. Please try again.");
      }
    } catch {
      setSubmitError("Couldn't send your reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: colors.neutral50 }}>
      <Helmet>
        <title>Conversation{thread ? ` with ${thread.profileName}` : ""}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-lg">
        {pageState === "loading" && (
          <p className="text-center text-sm" style={{ color: colors.neutral500 }}>Loading conversation…</p>
        )}

        {pageState === "error" && (
          <div className="text-center rounded-2xl p-8" style={{ background: "#ffffff", border: `1px solid ${colors.neutral200}` }}>
            <p className="text-sm" style={{ color: colors.neutral600 }}>{errorMessage}</p>
          </div>
        )}

        {pageState === "thread" && thread && (
          <div className="rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: `1px solid ${colors.neutral200}` }}>
            <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${colors.neutral100}` }}>
              <FiMessageSquare style={{ color: colors.primary500 }} />
              <h1 className="text-sm font-semibold" style={{ color: colors.neutral800 }}>
                Your conversation with {thread.profileName}
              </h1>
            </div>

            <div className="flex flex-col gap-3 p-5 max-h-[50vh] overflow-y-auto">
              {thread.messages.map((m) => {
                const isOwner = m.senderType === "OWNER";
                return (
                  <div key={m.id} className="flex" style={{ justifyContent: isOwner ? "flex-start" : "flex-end" }}>
                    <div
                      className="max-w-[80%] rounded-xl px-4 py-2.5"
                      style={{
                        background: isOwner ? colors.neutral100 : `${colors.primary500}1a`,
                        color: colors.neutral800,
                      }}
                    >
                      <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                      <p className="text-[10px] mt-1" style={{ color: colors.neutral500 }}>
                        {isOwner ? thread.profileName : "You"} · {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmitReply} className="flex gap-2 p-4" style={{ borderTop: `1px solid ${colors.neutral100}` }}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a reply..."
                rows={2}
                maxLength={2000}
                disabled={submitting}
                className="flex-1 text-sm rounded-lg px-3 py-2 outline-none resize-none"
                style={{ border: `1px solid ${colors.neutral200}`, color: colors.neutral800 }}
              />
              <button
                type="submit"
                disabled={submitting || !replyText.trim()}
                className="flex items-center justify-center rounded-lg px-4"
                style={{
                  background: colors.primary500,
                  color: "#ffffff",
                  opacity: submitting || !replyText.trim() ? 0.5 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
                aria-label="Send reply"
              >
                <FiSend size={16} />
              </button>
            </form>
            {submitError && <p className="text-xs px-4 pb-4" style={{ color: "#ef4444" }}>{submitError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactThreadPage;
