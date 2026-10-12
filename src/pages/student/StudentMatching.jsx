
import { useEffect, useState } from "react";
import axios from "axios";
import "./StudentMatching.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("jwtToken") ||
  localStorage.getItem("accessToken");

const getAuthHeaders = () => {
  const token = getToken();

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

const getMatchPercentage = (match) => {
  const value =
    match.matchPercentage ??
    match.matchScore ??
    match.score ??
    match.match_percent ??
    0;

  const percentage = Number(value);

  if (!Number.isFinite(percentage)) return 0;

  // Convert a 0–1 score to a percentage when appropriate.
  const normalized =
    percentage > 0 && percentage <= 1
      ? percentage * 100
      : percentage;

  return Math.max(0, Math.min(100, Math.round(normalized)));
};

const getMatchClass = (percentage) => {
  if (percentage >= 80) return "excellent";
  if (percentage >= 60) return "good";
  return "fair";
};

const getOpportunityTitle = (match) =>
  match.opportunityTitle ||
  match.title ||
  match.jobTitle ||
  match.opportunity?.title ||
  match.opportunity?.jobTitle ||
  "Opportunity";

const getCompanyName = (match) =>
  match.companyName ||
  match.company ||
  match.recruiterName ||
  match.opportunity?.companyName ||
  "Company not specified";

const getOpportunityId = (match) =>
  match.opportunityId ??
  match.opportunity?.id ??
  match.id ??
  null;

const getSkills = (match) => {
  const skills =
    match.requiredSkills ??
    match.skills ??
    match.opportunity?.requiredSkills ??
    [];

  if (Array.isArray(skills)) return skills;

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

function StudentMatching() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [minimumMatch, setMinimumMatch] = useState("0");
  const [sortBy, setSortBy] = useState("highest");
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/matching`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = response.data;

      const result = Array.isArray(data)
        ? data
        : Array.isArray(data?.matches)
          ? data.matches
          : Array.isArray(data?.content)
            ? data.content
            : [];

      setMatches(result);
    } catch (err) {
      console.error("Unable to load student matches:", err);

      if (err.response?.status === 401) {
        setError(
          "Your session may have expired. Please sign in again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to view these matches."
        );
      } else if (err.response?.status === 404) {
        setError(
          "The matching API endpoint was not found. Check the backend endpoint."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load matching opportunities. Please try again."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const filteredMatches = matches
    .map((match) => ({
      ...match,
      _percentage: getMatchPercentage(match),
    }))
    .filter((match) => {
      const query = search.trim().toLowerCase();

      const searchableText = [
        getOpportunityTitle(match),
        getCompanyName(match),
        ...getSkills(match),
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchableText.includes(query) &&
        match._percentage >= Number(minimumMatch)
      );
    })
    .sort((a, b) => {
      if (sortBy === "lowest") {
        return a._percentage - b._percentage;
      }

      if (sortBy === "title") {
        return getOpportunityTitle(a).localeCompare(
          getOpportunityTitle(b)
        );
      }

      return b._percentage - a._percentage;
    });

  const excellentMatches = matches.filter(
    (match) => getMatchPercentage(match) >= 80
  ).length;

  const averageMatch = matches.length
    ? Math.round(
        matches.reduce(
          (total, match) =>
            total + getMatchPercentage(match),
          0
        ) / matches.length
      )
    : 0;

  const openOpportunity = (match) => {
    const id = getOpportunityId(match);

    if (id === null || id === undefined) {
      setError(
        "This opportunity does not have an ID, so its details cannot be opened."
      );
      return;
    }

    window.location.href = `/opportunities/${id}`;
  };

  return (
    <main className="student-matching-page">
      <section className="matching-hero">
        <div className="matching-hero-content">
          <span className="matching-eyebrow">
            NEXLY CAREER INTELLIGENCE
          </span>

          <h1>
            Find opportunities
            <br />
            <span>that match you.</span>
          </h1>

          <p>
            Discover opportunities aligned with your skills
            and explore your next career move.
          </p>

          <button
            type="button"
            className="matching-refresh-button"
            onClick={() => loadMatches(true)}
            disabled={loading || refreshing}
          >
            {refreshing ? "Refreshing..." : "↻ Refresh matches"}
          </button>
        </div>

        <div className="matching-hero-decoration" aria-hidden="true">
          <div className="matching-orbit matching-orbit-one" />
          <div className="matching-orbit matching-orbit-two" />
          <div className="matching-hero-symbol">N</div>
          <span className="matching-floating-dot dot-one" />
          <span className="matching-floating-dot dot-two" />
          <span className="matching-floating-dot dot-three" />
        </div>
      </section>

      <section
        className="matching-stats"
        aria-label="Matching statistics"
      >
        <article className="matching-stat-card">
          <span className="matching-stat-icon">✦</span>
          <div>
            <p>Total opportunities</p>
            <strong>{loading ? "—" : matches.length}</strong>
          </div>
        </article>

        <article className="matching-stat-card">
          <span className="matching-stat-icon">◎</span>
          <div>
            <p>Strong matches</p>
            <strong>{loading ? "—" : excellentMatches}</strong>
            <small>80% match or higher</small>
          </div>
        </article>

        <article className="matching-stat-card">
          <span className="matching-stat-icon">↗</span>
          <div>
            <p>Average match</p>
            <strong>{loading ? "—" : `${averageMatch}%`}</strong>
          </div>
        </article>
      </section>

      <section className="matching-results-section">
        <div className="matching-section-heading">
          <div>
            <span className="matching-section-label">
              PERSONALIZED FOR YOU
            </span>
            <h2>Your opportunity matches</h2>
            <p>
              Compare your match scores and explore suitable
              opportunities.
            </p>
          </div>

          <span className="matching-result-count">
            {loading
              ? "Loading..."
              : `${filteredMatches.length} results`}
          </span>
        </div>

        <div className="matching-filters">
          <label className="matching-search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles, companies or skills..."
              aria-label="Search opportunities"
            />
          </label>

          <label className="matching-filter-control">
            <span>Minimum match</span>
            <select
              value={minimumMatch}
              onChange={(event) =>
                setMinimumMatch(event.target.value)
              }
            >
              <option value="0">Any score</option>
              <option value="40">40% and above</option>
              <option value="60">60% and above</option>
              <option value="80">80% and above</option>
            </select>
          </label>

          <label className="matching-filter-control">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="highest">Best match</option>
              <option value="lowest">Lowest match</option>
              <option value="title">Opportunity name</option>
            </select>
          </label>
        </div>

        {error && (
          <div className="matching-error" role="alert">
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => loadMatches()}
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div
            className="matching-loading-grid"
            aria-label="Loading opportunities"
          >
            {[1, 2, 3].map((item) => (
              <div className="matching-skeleton" key={item}>
                <div className="matching-skeleton-line skeleton-short" />
                <div className="matching-skeleton-line skeleton-long" />
                <div className="matching-skeleton-line skeleton-medium" />
                <div className="matching-skeleton-line skeleton-bottom" />
              </div>
            ))}
          </div>
        ) : !error && filteredMatches.length === 0 ? (
          <div className="matching-empty-state">
            <div className="matching-empty-icon">⌕</div>
            <h3>
              {matches.length === 0
                ? "No matches available yet"
                : "No matching opportunities found"}
            </h3>
            <p>
              {matches.length === 0
                ? "Check back later or refresh to look for available opportunities."
                : "Try changing your search or lowering the minimum match score."}
            </p>

            <button
              type="button"
              className="matching-empty-button"
              onClick={() => {
                setSearch("");
                setMinimumMatch("0");
                setSortBy("highest");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="matching-cards-grid">
            {filteredMatches.map((match, index) => {
              const percentage = match._percentage;
              const matchClass = getMatchClass(percentage);
              const skills = getSkills(match);
              const opportunityId = getOpportunityId(match);

              return (
                <article
                  className="matching-card"
                  key={
                    opportunityId ??
                    match.id ??
                    `${getOpportunityTitle(match)}-${index}`
                  }
                >
                  <div className="matching-card-top">
                    <div className="matching-opportunity-icon">
                      N
                    </div>

                    <span
                      className={`matching-badge ${matchClass}`}
                    >
                      {percentage >= 80
                        ? "Excellent match"
                        : percentage >= 60
                          ? "Good match"
                          : "Potential match"}
                    </span>
                  </div>

                  <div className="matching-card-main">
                    <h3>{getOpportunityTitle(match)}</h3>
                    <p className="matching-company">
                      {getCompanyName(match)}
                    </p>

                    <div className="matching-opportunity-meta">
                      {(match.location ||
                        match.opportunity?.location) && (
                        <span>
                          ⌖{" "}
                          {match.location ||
                            match.opportunity?.location}
                        </span>
                      )}

                      {(match.opportunityType ||
                        match.type ||
                        match.opportunity?.type) && (
                        <span>
                          ◈{" "}
                          {match.opportunityType ||
                            match.type ||
                            match.opportunity?.type}
                        </span>
                      )}
                    </div>

                    {match.description && (
                      <p className="matching-description">
                        {match.description.length > 150
                          ? `${match.description.slice(0, 150)}…`
                          : match.description}
                      </p>
                    )}
                  </div>

                  <div className="matching-score-area">
                    <div className="matching-score-label">
                      <span>Your compatibility</span>
                      <strong>{percentage}%</strong>
                    </div>

                    <div
                      className="matching-progress-track"
                      role="progressbar"
                      aria-label="Match percentage"
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`matching-progress-fill ${matchClass}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {skills.length > 0 && (
                    <div className="matching-skills">
                      <span className="matching-skills-label">
                        Relevant skills
                      </span>

                      <div className="matching-skill-tags">
                        {skills.slice(0, 5).map((skill, skillIndex) => (
                          <span key={`${skill}-${skillIndex}`}>
                            {skill}
                          </span>
                        ))}

                        {skills.length > 5 && (
                          <span>+{skills.length - 5}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="matching-card-footer">
                    <span className="matching-card-footer-note">
                      {percentage >= 80
                        ? "Highly aligned with your profile"
                        : percentage >= 60
                          ? "Worth exploring"
                          : "Explore and build relevant skills"}
                    </span>

                    <button
                      type="button"
                      className="matching-view-button"
                      onClick={() => openOpportunity(match)}
                      disabled={
                        opportunityId === null ||
                        opportunityId === undefined
                      }
                    >
                      View details <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default StudentMatching;
