import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./RecruiterOpportunities.css";

function RecruiterOpportunities() {

    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const loadOpportunities = async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get(
                "/recruiter/opportunities"
            );

            setOpportunities(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Load opportunities error:",
                err
            );

            const message =
                typeof err?.response?.data === "string"
                    ? err.response.data
                    : err?.response?.data?.message ||
                      "Unable to load opportunities. Please try again.";

            setError(message);

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadOpportunities();
    }, []);

    const handleDelete = async (id, title) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(id);
            setError("");

            await api.delete(
                `/recruiter/opportunities/${id}`
            );

            setOpportunities((previous) =>
                previous.filter(
                    (opportunity) =>
                        opportunity.id !== id
                )
            );

        } catch (err) {

            console.error(
                "Delete opportunity error:",
                err
            );

            const message =
                typeof err?.response?.data === "string"
                    ? err.response.data
                    : err?.response?.data?.message ||
                      "Unable to delete opportunity. Please try again.";

            setError(message);

        } finally {

            setDeletingId(null);
        }
    };

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "No deadline";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Invalid date";
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTypeLabel = (type) => {

        if (!type) {
            return "Opportunity";
        }

        const labels = {
            JOB: "Full-time Job",
            INTERNSHIP: "Internship",
            PROJECT: "Project",
        };

        return labels[type] || type;
    };

    const getWorkModeLabel = (workMode) => {

        if (!workMode) {
            return "Not specified";
        }

        const labels = {
            ONSITE: "On-site",
            REMOTE: "Remote",
            HYBRID: "Hybrid",
        };

        return labels[workMode] || workMode;
    };

    const getStatusClass = (status) => {

        if (!status) {
            return "status-default";
        }

        return `status-${status
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
    };

    return (
        <div className="recruiter-opportunities-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="opportunities-page-header">

                <div className="opportunities-header-content">

                    <span className="opportunities-page-label">
                        RECRUITER PORTAL
                    </span>

                    <h1>
                        Manage Opportunities
                    </h1>

                    <p>
                        View and manage the jobs, internships
                        and projects published by your company.
                    </p>

                </div>

                <div className="opportunities-header-actions">

                    <button
                        type="button"
                        className="refresh-opportunities-button"
                        onClick={() => loadOpportunities(true)}
                        disabled={loading || refreshing}
                    >
                        <span
                            className={
                                refreshing
                                    ? "refresh-icon spinning"
                                    : "refresh-icon"
                            }
                        >
                            ↻
                        </span>

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                    <button
                        type="button"
                        className="create-opportunity-button"
                        onClick={() =>
                            navigate(
                                "/recruiter/opportunities/create"
                            )
                        }
                    >
                        <span>+</span>
                        Create Opportunity
                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="opportunities-error">

                    <div className="error-icon">
                        !
                    </div>

                    <div className="error-content">

                        <strong>
                            Something went wrong
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadOpportunities(true)
                        }
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="opportunities-loading">

                    <div className="loading-spinner" />

                    <h3>
                        Loading opportunities...
                    </h3>

                    <p>
                        Please wait while we fetch your
                        published opportunities.
                    </p>

                </div>

            ) : opportunities.length === 0 ? (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div className="opportunities-empty">

                    <div className="empty-icon">
                        +
                    </div>

                    <h2>
                        No opportunities yet
                    </h2>

                    <p>
                        You haven't created any opportunities.
                        Publish your first job, internship or
                        project to start connecting with students.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/recruiter/opportunities/create"
                            )
                        }
                    >
                        <span>+</span>
                        Create Your First Opportunity
                    </button>

                </div>

            ) : (

                /* =================================================
                   OPPORTUNITIES
                ================================================= */

                <div className="opportunities-container">

                    <div className="opportunities-summary">

                        <div>
                            <span className="summary-label">
                                TOTAL OPPORTUNITIES
                            </span>

                            <strong>
                                {opportunities.length}
                            </strong>
                        </div>

                        <div className="summary-divider" />

                        <p>
                            Manage your company's
                            active opportunities below.
                        </p>

                    </div>


                    <div className="opportunities-grid">

                        {opportunities.map(
                            (opportunity) => (

                                <article
                                    className="opportunity-management-card"
                                    key={opportunity.id}
                                >

                                    {/* TOP */}

                                    <div className="opportunity-card-top">

                                        <div className="opportunity-type-icon">
                                            {opportunity.type ===
                                            "INTERNSHIP"
                                                ? "I"
                                                : opportunity.type ===
                                                  "PROJECT"
                                                ? "P"
                                                : "J"}
                                        </div>

                                        <div className="opportunity-card-heading">

                                            <h2>
                                                {opportunity.title ||
                                                    "Untitled Opportunity"}
                                            </h2>

                                            <span>
                                                {getTypeLabel(
                                                    opportunity.type
                                                )}
                                            </span>

                                        </div>

                                        <span
                                            className={`opportunity-status ${getStatusClass(
                                                opportunity.status
                                            )}`}
                                        >
                                            <span className="status-dot" />

                                            {opportunity.status ||
                                                "UNKNOWN"}
                                        </span>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="opportunity-details">

                                        <div className="opportunity-detail">

                                            <span className="detail-icon">
                                                ◎
                                            </span>

                                            <div>
                                                <span>
                                                    Location
                                                </span>

                                                <strong>
                                                    {opportunity.location ||
                                                        "Not specified"}
                                                </strong>
                                            </div>

                                        </div>


                                        <div className="opportunity-detail">

                                            <span className="detail-icon">
                                                ◈
                                            </span>

                                            <div>
                                                <span>
                                                    Work Mode
                                                </span>

                                                <strong>
                                                    {getWorkModeLabel(
                                                        opportunity.workMode
                                                    )}
                                                </strong>
                                            </div>

                                        </div>


                                        <div className="opportunity-detail">

                                            <span className="detail-icon">
                                                ₹
                                            </span>

                                            <div>
                                                <span>
                                                    Salary / Stipend
                                                </span>

                                                <strong>
                                                    {opportunity.salary ||
                                                        "Not specified"}
                                                </strong>
                                            </div>

                                        </div>


                                        <div className="opportunity-detail">

                                            <span className="detail-icon">
                                                ◷
                                            </span>

                                            <div>
                                                <span>
                                                    Application Deadline
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        opportunity.applicationDeadline
                                                    )}
                                                </strong>
                                            </div>

                                        </div>

                                    </div>


                                    {/* DESCRIPTION */}

                                    {opportunity.description && (
                                        <div className="opportunity-description">

                                            <span>
                                                Description
                                            </span>

                                            <p>
                                                {opportunity.description}
                                            </p>

                                        </div>
                                    )}


                                    {/* ACTIONS */}

                                    <div className="opportunity-card-actions">

                                        <button
                                            type="button"
                                            className="view-opportunity-button"
                                            onClick={() =>
                                                navigate(
                                                    `/student/opportunities/${opportunity.id}`
                                                )
                                            }
                                        >
                                            View
                                            <span>→</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-opportunity-button"
                                            onClick={() =>
                                                handleDelete(
                                                    opportunity.id,
                                                    opportunity.title
                                                )
                                            }
                                            disabled={
                                                deletingId ===
                                                opportunity.id
                                            }
                                        >
                                            {deletingId ===
                                            opportunity.id ? (
                                                <>
                                                    <span className="delete-spinner" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <span>×</span>
                                                    Delete
                                                </>
                                            )}
                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default RecruiterOpportunities;