
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Loading from "../../components/Loading";
import api from "../../services/api";

import "./BrowseOpportunities.css";

function BrowseOpportunities() {
    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [workModeFilter, setWorkModeFilter] = useState("ALL");
    const [locationFilter, setLocationFilter] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadOpportunities();
    }, []);

    const loadOpportunities = async () => {
        try {
            setRefreshing(true);
            setError("");

            const response = await api.get("/opportunities");

            setOpportunities(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (err) {
            console.error("Opportunity loading error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load opportunities."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Handles dates with or without a time component.
    const getDeadlineDate = (date) => {
        if (!date) return null;

        const parsed = new Date(date);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const isExpired = (opportunity) => {
        const deadline = getDeadlineDate(
            opportunity.applicationDeadline
        );

        // Do not expire an opportunity that has no deadline.
        if (!deadline) return false;

        return deadline.getTime() < Date.now();
    };

    const getOpportunityStatus = (opportunity) => {
        if (isExpired(opportunity)) {
            return "EXPIRED";
        }

        const status = String(
            opportunity.status || "PUBLISHED"
        ).toUpperCase();

        if (["CLOSED", "EXPIRED", "CANCELLED"].includes(status)) {
            return status;
        }

        if (["DRAFT", "PENDING"].includes(status)) {
            return status;
        }

        return "OPEN";
    };

    const filteredOpportunities = useMemo(() => {
        const searchText = search.trim().toLowerCase();
        const locationText = locationFilter.trim().toLowerCase();

        return opportunities.filter((opportunity) => {
            const title = opportunity.title?.toLowerCase() || "";
            const description =
                opportunity.description?.toLowerCase() || "";
            const company =
                opportunity.company?.companyName?.toLowerCase() || "";
            const location = opportunity.location?.toLowerCase() || "";
            const type = opportunity.type?.toLowerCase() || "";
            const workMode = opportunity.workMode?.toLowerCase() || "";

            const matchesSearch =
                !searchText ||
                title.includes(searchText) ||
                description.includes(searchText) ||
                company.includes(searchText) ||
                location.includes(searchText);

            const matchesType =
                typeFilter === "ALL" ||
                type === typeFilter.toLowerCase();

            const matchesWorkMode =
                workModeFilter === "ALL" ||
                workMode === workModeFilter.toLowerCase();

            const matchesLocation =
                !locationText || location.includes(locationText);

            return (
                matchesSearch &&
                matchesType &&
                matchesWorkMode &&
                matchesLocation
            );
        });
    }, [
        opportunities,
        search,
        typeFilter,
        workModeFilter,
        locationFilter
    ]);

    const formatDeadline = (date) => {
        if (!date) return "No deadline";

        const parsed = getDeadlineDate(date);

        if (!parsed) return "Date unavailable";

        return parsed.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const clearFilters = () => {
        setSearch("");
        setTypeFilter("ALL");
        setWorkModeFilter("ALL");
        setLocationFilter("");
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loading text="Finding opportunities for you..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="browse-page">
                <div className="browse-header">
                    <div>
                        <span className="browse-eyebrow">DISCOVER</span>
                        <h1>Find your next opportunity</h1>
                        <p>
                            Explore internships, jobs and other opportunities
                            that can help you move your career forward.
                        </p>
                    </div>

                    <div className="browse-header-icon">🔎</div>
                </div>

                {error && (
                    <div className="browse-alert">
                        <span>!</span>
                        {error}
                        <button type="button" onClick={loadOpportunities}>
                            Retry
                        </button>
                    </div>
                )}

                <div className="browse-search-card">
                    <div className="main-search">
                        <span>🔍</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search jobs, internships, companies or skills..."
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <div className="filter-row">
                        <div className="filter-field">
                            <label>Opportunity Type</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="ALL">All Types</option>
                                <option value="INTERNSHIP">Internship</option>
                                <option value="JOB">Job</option>
                                <option value="PROJECT">Project</option>
                            </select>
                        </div>

                        <div className="filter-field">
                            <label>Work Mode</label>
                            <select
                                value={workModeFilter}
                                onChange={(e) =>
                                    setWorkModeFilter(e.target.value)
                                }
                            >
                                <option value="ALL">All Modes</option>
                                <option value="REMOTE">Remote</option>
                                <option value="HYBRID">Hybrid</option>
                                <option value="ONSITE">On-site</option>
                            </select>
                        </div>

                        <div className="filter-field">
                            <label>Location</label>
                            <input
                                type="text"
                                value={locationFilter}
                                onChange={(e) =>
                                    setLocationFilter(e.target.value)
                                }
                                placeholder="e.g. Hyderabad"
                            />
                        </div>

                        <button
                            type="button"
                            className="clear-filters"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="browse-results-header">
                    <div>
                        <span>OPPORTUNITIES</span>
                        <h2>
                            {filteredOpportunities.length} opportunities found
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={loadOpportunities}
                        className="refresh-button"
                        disabled={refreshing}
                    >
                        {refreshing ? "Refreshing..." : "↻ Refresh"}
                    </button>
                </div>

                {filteredOpportunities.length === 0 ? (
                    <div className="browse-empty">
                        <div className="browse-empty-icon">🔎</div>
                        <h2>No opportunities found</h2>
                        <p>
                            Try changing your search or removing some filters.
                        </p>
                        <button type="button" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="opportunity-grid">
                        {filteredOpportunities.map((opportunity) => {
                            const companyName =
                                opportunity.company?.companyName || "Company";

                            const status = getOpportunityStatus(opportunity);
                            const expired = status === "EXPIRED";

                            const unavailable = [
                                "EXPIRED",
                                "CLOSED",
                                "CANCELLED",
                                "DRAFT",
                                "PENDING"
                            ].includes(status);

                            return (
                                <div
                                    className={`opportunity-card ${
                                        unavailable ? "opportunity-card-closed" : ""
                                    }`}
                                    key={opportunity.id}
                                >
                                    <div className="opportunity-top">
                                        <div className="company-avatar">
                                            {companyName.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="company-info">
                                            <strong>{companyName}</strong>
                                            <span>
                                                {opportunity.location ||
                                                    "Location not specified"}
                                            </span>
                                        </div>

                                        <span className="opportunity-type">
                                            {opportunity.type || "Opportunity"}
                                        </span>
                                    </div>

                                    <h3>{opportunity.title}</h3>

                                    <p className="opportunity-description">
                                        {opportunity.description
                                            ? opportunity.description.length > 135
                                                ? opportunity.description.substring(
                                                      0,
                                                      135
                                                  ) + "..."
                                                : opportunity.description
                                            : "No description provided."}
                                    </p>

                                    <div className="opportunity-meta">
                                        <span>
                                            🏠 {opportunity.workMode || "Not specified"}
                                        </span>
                                        <span>
                                            📍 {opportunity.location || "Not specified"}
                                        </span>
                                        <span>
                                            📅 {formatDeadline(
                                                opportunity.applicationDeadline
                                            )}
                                        </span>
                                    </div>

                                    <div className="opportunity-footer">
                                        <span
                                            className={`opportunity-status status-${status.toLowerCase()}`}
                                        >
                                            ● {
                                                expired
                                                    ? "Expired"
                                                    : status === "OPEN"
                                                    ? "Open"
                                                    : status.charAt(0) +
                                                      status.slice(1).toLowerCase()
                                            }
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/student/opportunities/${opportunity.id}`
                                                )
                                            }
                                        >
                                            View Details →
                                        </button>
                                    </div>

                                    {expired && (
                                        <p className="expired-notice">
                                            The application deadline has passed.
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default BrowseOpportunities;
