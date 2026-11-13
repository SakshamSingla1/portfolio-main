import { useState } from "react";
import { useColors } from "../../../utils/theme";

interface PortfolioAccessGateProps {
  onSubmit: (accessCode: string) => Promise<boolean>;
}

// Shown in place of the portfolio when ProfileMasterServiceImpl's gate rejects the request with
// PROFILE_ACCESS_REQUIRED (see Index.tsx). On a correct code, onSubmit stores the returned token
// and Index.tsx re-fetches; a wrong code just shows an inline error and lets the visitor retry.
const PortfolioAccessGate: React.FC<PortfolioAccessGateProps> = ({ onSubmit }) => {
  const colors = useColors();
  const [accessCode, setAccessCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    const ok = await onSubmit(accessCode.trim());
    setSubmitting(false);
    if (!ok) {
      setError("Incorrect access code. Please try again.");
      setAccessCode("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: colors.neutral900 }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-5"
        style={{ background: colors.neutral800, border: `1px solid ${colors.neutral700}` }}
      >
        <div className="flex flex-col gap-1 text-center">
          <span
            className="mx-auto mb-2 flex items-center justify-center w-11 h-11 rounded-full"
            style={{ background: `${colors.primary500}22` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <h1 className="text-lg font-semibold" style={{ color: "#ffffff" }}>
            This portfolio is private
          </h1>
          <p className="text-sm" style={{ color: colors.neutral500 }}>
            Enter the access code to continue.
          </p>
        </div>

        <input
          type="password"
          autoFocus
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="Access code"
          disabled={submitting}
          className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
          style={{
            background: colors.neutral900,
            border: `1px solid ${error ? "#ef4444" : colors.neutral700}`,
            color: "#ffffff",
          }}
        />

        {error && (
          <p className="text-xs -mt-3" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !accessCode.trim()}
          className="w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity"
          style={{
            background: colors.primary500,
            color: "#ffffff",
            opacity: submitting || !accessCode.trim() ? 0.6 : 1,
            cursor: submitting || !accessCode.trim() ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
};

export default PortfolioAccessGate;
