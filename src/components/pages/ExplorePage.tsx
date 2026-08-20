import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { request } from "../../services";
import { useColors } from "../../utils/theme";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiUser } from "react-icons/fi";
import SafeImage from "../atoms/SafeImage/SafeImage";

interface DiscoverProfile {
  id: number;
  fullName: string;
  userName: string;
  title: string;
  location: string;
  profileImageUrl: string | null;
  topSkills: string[];
}

const ExplorePage = () => {
  const colors = useColors();
  const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [query, setQuery] = useState({ search: "", skill: "" });

  useEffect(() => {
    setLoading(true);
    request('get', '/explore', null, undefined, {
      params: {
        search: query.search || undefined,
        skill: query.skill || undefined,
      },
    })
      .then((res) => setProfiles(res?.data?.data ?? []))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery({ search, skill });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: colors.neutral900, color: colors.neutral100 }}
    >
      <Helmet>
        <title>Explore Portfolios — PortfoliosBuilder</title>
        <meta name="description" content="Discover developers and designers by skill or role on PortfoliosBuilder." />
      </Helmet>

      <div
        className="py-16 px-4 text-center"
        style={{ borderBottom: `1px solid ${colors.neutral800}` }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: colors.neutral100 }}
        >
          Explore Portfolios
        </motion.h1>
        <p className="text-sm mb-8" style={{ color: colors.neutral400 }}>
          Discover developers and designers by skill or role
        </p>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto"
        >
          <div className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5"
            style={{ background: colors.neutral800, border: `1px solid ${colors.neutral700}` }}>
            <FiSearch style={{ color: colors.neutral500, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Name or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: colors.neutral100, width: "100%", fontSize: 14,
              }}
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5"
            style={{ background: colors.neutral800, border: `1px solid ${colors.neutral700}`, minWidth: 150 }}>
            <FiUser style={{ color: colors.neutral500, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Skill (e.g. React)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: colors.neutral100, width: "100%", fontSize: 14,
              }}
            />
          </div>
          <button
            type="submit"
            className="rounded-xl px-6 py-2.5 font-semibold text-sm"
            style={{ background: colors.primary500, color: "#fff", border: "none", cursor: "pointer" }}
          >
            Search
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20 text-sm" style={{ color: colors.neutral500 }}>
            Loading…
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 text-sm" style={{ color: colors.neutral500 }}>
            No portfolios found. Try a different search.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: `${colors.neutral800}80`,
                  border: `1px solid ${colors.neutral700}40`,
                }}
              >
                <div className="flex items-center gap-3">
                  {p.profileImageUrl ? (
                    <SafeImage
                      src={p.profileImageUrl}
                      alt={p.fullName}
                      className="rounded-full object-cover"
                      fallbackClassName="rounded-full"
                      iconSize={16}
                      style={{ width: 48, height: 48, flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      className="rounded-full flex items-center justify-center font-bold text-lg"
                      style={{
                        width: 48, height: 48, flexShrink: 0,
                        background: `linear-gradient(135deg, ${colors.primary500}, ${colors.primary600})`,
                        color: "#fff",
                      }}
                    >
                      {p.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: colors.neutral100 }}>
                      {p.fullName}
                    </p>
                    <p className="text-xs truncate" style={{ color: colors.neutral400 }}>
                      {p.title}
                    </p>
                  </div>
                </div>

                {p.location && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: colors.neutral500 }}>
                    <FiMapPin size={11} />
                    <span className="truncate">{p.location}</span>
                  </div>
                )}

                {p.topSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {p.topSkills.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{
                          background: `${colors.primary500}18`,
                          color: colors.primary400,
                          border: `1px solid ${colors.primary500}30`,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
