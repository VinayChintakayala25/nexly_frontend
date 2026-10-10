import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "./StudentApplications.css";

function StudentApplications() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/applications/student"
            );

            setApplications(response.data || []);
        } catch (err) {
            console.error(
                "Applications loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load your applications."
            );
        } finally {
            setLoading(false);
        }
    };

    const getOpportunity = (application) => {
        return application?.opportunity || {};
    };

    const getCompany = (application) => {
        const opportunity = getOpportunity(application);

        return opportunity?.company || {};
    };

    const getCompanyName = (application) => {
        const company = getCompany(application);

        return (
            company.companyName ||
            opportunityCompanyName(application) ||
            "Company"
        );
    };

    const opportunityCompanyName = (application) => {
        const opportunity = getOpportunity(application);

        return (
            opportunity.companyName ||
            application?.companyName ||
            "Company"
        );
    };

    const getTitle = (application) => {
        const opportunity = getOpportunity(application);

        return (
            opportunity.title ||
            application?.opportunityTitle ||
            "Opportunity"
        );
    };

    const getStatus = (application) => {
        return application?.status || "APPLIED";
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Applied";
        }

        return status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "APPLIED":
                return "status-applied";

            case "UNDER_REVIEW":
                return "status-review";

            case "SHORTLISTED":
                return "status-shortlisted";

            case "INTERVIEW_SCHEDULED":
                return "status-interview";

            case "SELECTED":
                return "status-selected";

            case "REJECTED":
                return "status-rejected";

            case "WITHDRAWN":
                return "status-withdrawn";

            default:
                return "status-applied";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "Date unavailable";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const filteredApplications = useMemo(() => {
        const searchText = search
            .trim()
            .toLowerCase();

        return applications.filter((application) => {
            const status = getStatus(application);

            const matchesStatus =
                activeFilter === "ALL" ||
                status === activeFilter;

            const title = getTitle(application);
            const company = getCompanyName(application);

            const matchesSearch =
                !searchText ||
                title
                    .toLowerCase()
                    .includes(searchText) ||
                company
                    .toLowerCase()
                    .includes(searchText);

            return matchesStatus && matchesSearch;
        });
    }, [
        applications,
        activeFilter,
        search,
    ]);

    const counts = useMemo(() => {
        return {
            all: applications.length,

            applied: applications.filter(
                (application) =>
                    getStatus(application) === "APPLIED"
            ).length,

            review: applications.filter(
                (application) =>
                    getStatus(application) ===
                    "UNDER_REVIEW"
            ).length,

            shortlisted: applications.filter(
                (application) =>
                    getStatus(application) ===
                    "SHORTLISTED"
            ).length,

            interview: applications.filter(
                (application) =>
                    getStatus(application) ===
                    "INTERVIEW_SCHEDULED"
            ).length,

            selected: applications.filter(
                (application) =>
                    getStatus(application) ===
                    "SELECTED"
            ).length,

            rejected: applications.filter(
                (application) =>
                    getStatus(application) ===
                    "REJECTED"
            ).length,
        };
    }, [applications]);

    const handleViewOpportunity = (application) => {
        const opportunity = getOpportunity(application);

        if (opportunity?.id) {
            navigate(
                `/student/opportunities/${opportunity.id}`
            );
        }
    };

    return (
        <div className="student-applications-page">

            {/* HEADER */}

            <div className="applications-page-header">

                <div>
                    <span className="applications-eyebrow">
                        YOUR CAREER JOURNEY
                    </span>

                    <h1>
                        My Applications
                    </h1>

                    <p>
                        Track your applications and see
                        where you stand in the hiring process.
                    </p>
                </div>

                <button
                    className="browse-opportunities-button"
                    onClick={() =>
                        navigate(
                            "/student/opportunities"
                        )
                    }
                >
                    Browse Opportunities
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="applications-error">
                    ⚠ {error}

                    <button
                        onClick={loadApplications}
                    >
                        Try Again
                    </button>
                </div>
            )}


            {/* SUMMARY */}

            {!loading && (
                <div className="application-summary">

                    <div className="application-summary-card">
                        <span>Total Applications</span>
                        <strong>{counts.all}</strong>
                    </div>

                    <div className="application-summary-card">
                        <span>Under Review</span>
                        <strong>{counts.review}</strong>
                    </div>

                    <div className="application-summary-card">
                        <span>Shortlisted</span>
                        <strong>{counts.shortlisted}</strong>
                    </div>

                    <div className="application-summary-card">
                        <span>Interviews</span>
                        <strong>{counts.interview}</strong>
                    </div>

                    <div className="application-summary-card">
                        <span>Selected</span>
                        <strong>{counts.selected}</strong>
                    </div>

                </div>
            )}


            {/* FILTERS */}

            <section className="applications-filter-card">

                <div className="applications-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search by opportunity or company..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>


                <div className="application-filter-buttons">

                    <button
                        className={
                            activeFilter === "ALL"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter("ALL")
                        }
                    >
                        All
                        <span>{counts.all}</span>
                    </button>

                    <button
                        className={
                            activeFilter === "APPLIED"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter("APPLIED")
                        }
                    >
                        Applied
                        <span>{counts.applied}</span>
                    </button>

                    <button
                        className={
                            activeFilter === "UNDER_REVIEW"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter("UNDER_REVIEW")
                        }
                    >
                        Under Review
                        <span>{counts.review}</span>
                    </button>

                    <button
                        className={
                            activeFilter === "SHORTLISTED"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter("SHORTLISTED")
                        }
                    >
                        Shortlisted
                        <span>{counts.shortlisted}</span>
                    </button>

                    <button
                        className={
                            activeFilter ===
                            "INTERVIEW_SCHEDULED"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter(
                                "INTERVIEW_SCHEDULED"
                            )
                        }
                    >
                        Interview
                        <span>{counts.interview}</span>
                    </button>

                    <button
                        className={
                            activeFilter === "SELECTED"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter("SELECTED")
                        }
                    >
                        Selected
                        <span>{counts.selected}</span>
                    </button>

                    <button
                        className={
                            activeFilter === "REJECTED"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter("REJECTED")
                        }
                    >
                        Rejected
                        <span>{counts.rejected}</span>
                    </button>

                </div>

            </section>


            {/* APPLICATIONS */}

            {loading ? (
                <div className="applications-loading">
                    <Loading />
                </div>
            ) : filteredApplications.length === 0 ? (

                <div className="applications-empty">

                    <div className="applications-empty-icon">
                        ▤
                    </div>

                    <h2>
                        {applications.length === 0
                            ? "No applications yet"
                            : "No applications found"}
                    </h2>

                    <p>
                        {applications.length === 0
                            ? "Start exploring opportunities and apply for roles that match your goals."
                            : "Try changing your search or status filter."}
                    </p>

                    {applications.length === 0 && (
                        <button
                            onClick={() =>
                                navigate(
                                    "/student/opportunities"
                                )
                            }
                        >
                            Explore Opportunities
                        </button>
                    )}

                </div>

            ) : (

                <div className="applications-list">

                    {filteredApplications.map(
                        (application) => {

                            const opportunity =
                                getOpportunity(
                                    application
                                );

                            const company =
                                getCompany(
                                    application
                                );

                            const companyName =
                                getCompanyName(
                                    application
                                );

                            const title =
                                getTitle(
                                    application
                                );

                            const status =
                                getStatus(
                                    application
                                );

                            return (
                                <article
                                    className="application-card"
                                    key={
                                        application.id
                                    }
                                >

                                    <div className="application-company-logo">
                                        {companyName
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>


                                    <div className="application-main-info">

                                        <div className="application-title-row">

                                            <div>
                                                <h2>
                                                    {title}
                                                </h2>

                                                <p>
                                                    {companyName}
                                                </p>
                                            </div>

                                            <span
                                                className={`application-status ${getStatusClass(
                                                    status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    status
                                                )}
                                            </span>

                                        </div>


                                        <div className="application-meta">

                                            {opportunity.location && (
                                                <span>
                                                    📍{" "}
                                                    {
                                                        opportunity.location
                                                    }
                                                </span>
                                            )}

                                            {opportunity.workMode && (
                                                <span>
                                                    💼{" "}
                                                    {
                                                        opportunity.workMode
                                                    }
                                                </span>
                                            )}

                                            {opportunity.type && (
                                                <span>
                                                    ◆{" "}
                                                    {
                                                        opportunity.type
                                                    }
                                                </span>
                                            )}

                                            <span>
                                                Applied{" "}
                                                {formatDate(
                                                    application.appliedAt
                                                )}
                                            </span>

                                        </div>


                                        {/* STATUS TIMELINE */}

                                        <div className="application-progress">

                                            <div
                                                className={
                                                    status !==
                                                        "REJECTED" &&
                                                    status !==
                                                        "WITHDRAWN"
                                                        ? "progress-step completed"
                                                        : "progress-step"
                                                }
                                            >
                                                <span>
                                                    1
                                                </span>

                                                <small>
                                                    Applied
                                                </small>
                                            </div>

                                            <div
                                                className={
                                                    [
                                                        "UNDER_REVIEW",
                                                        "SHORTLISTED",
                                                        "INTERVIEW_SCHEDULED",
                                                        "SELECTED",
                                                    ].includes(
                                                        status
                                                    )
                                                        ? "progress-step completed"
                                                        : "progress-step"
                                                }
                                            >
                                                <span>
                                                    2
                                                </span>

                                                <small>
                                                    Review
                                                </small>
                                            </div>

                                            <div
                                                className={
                                                    [
                                                        "SHORTLISTED",
                                                        "INTERVIEW_SCHEDULED",
                                                        "SELECTED",
                                                    ].includes(
                                                        status
                                                    )
                                                        ? "progress-step completed"
                                                        : "progress-step"
                                                }
                                            >
                                                <span>
                                                    3
                                                </span>

                                                <small>
                                                    Shortlisted
                                                </small>
                                            </div>

                                            <div
                                                className={
                                                    [
                                                        "INTERVIEW_SCHEDULED",
                                                        "SELECTED",
                                                    ].includes(
                                                        status
                                                    )
                                                        ? "progress-step completed"
                                                        : "progress-step"
                                                }
                                            >
                                                <span>
                                                    4
                                                </span>

                                                <small>
                                                    Interview
                                                </small>
                                            </div>

                                            <div
                                                className={
                                                    status ===
                                                    "SELECTED"
                                                        ? "progress-step completed"
                                                        : "progress-step"
                                                }
                                            >
                                                <span>
                                                    5
                                                </span>

                                                <small>
                                                    Selected
                                                </small>
                                            </div>

                                        </div>

                                    </div>


                                    <button
                                        className="application-view-button"
                                        onClick={() =>
                                            handleViewOpportunity(
                                                application
                                            )
                                        }
                                    >
                                        View
                                    </button>

                                </article>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
}

export default StudentApplications;