import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminOpportunities.css";

function AdminOpportunities() {
    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [workModeFilter, setWorkModeFilter] = useState("ALL");

    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // =====================================================
    // LOAD OPPORTUNITIES
    // =====================================================

    const loadOpportunities = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/opportunities");

            setOpportunities(response.data);
        } catch (err) {
            console.error("Failed to load opportunities:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to load opportunities."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOpportunities();
    }, []);

    // =====================================================
    // FILTER OPTIONS
    // =====================================================

    const types = useMemo(() => {
        return [
            ...new Set(
                opportunities
                    .map((opportunity) => opportunity.type)
                    .filter(Boolean)
            ),
        ];
    }, [opportunities]);

    const workModes = useMemo(() => {
        return [
            ...new Set(
                opportunities
                    .map((opportunity) => opportunity.workMode)
                    .filter(Boolean)
            ),
        ];
    }, [opportunities]);

    // =====================================================
    // FILTERED OPPORTUNITIES
    // =====================================================

    const filteredOpportunities = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return opportunities.filter((opportunity) => {
            const matchesSearch =
                !searchText ||
                opportunity.title?.toLowerCase().includes(searchText) ||
                opportunity.companyName?.toLowerCase().includes(searchText) ||
                opportunity.location?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "ALL" ||
                opportunity.status === statusFilter;

            const matchesType =
                typeFilter === "ALL" ||
                opportunity.type === typeFilter;

            const matchesWorkMode =
                workModeFilter === "ALL" ||
                opportunity.workMode === workModeFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesType &&
                matchesWorkMode
            );
        });
    }, [
        opportunities,
        search,
        statusFilter,
        typeFilter,
        workModeFilter,
    ]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalOpportunities = opportunities.length;

    const publishedCount = opportunities.filter(
        (item) => item.status === "PUBLISHED"
    ).length;

    const draftCount = opportunities.filter(
        (item) => item.status === "DRAFT"
    ).length;

    const closedCount = opportunities.filter(
        (item) => item.status === "CLOSED"
    ).length;

    // =====================================================
    // DELETE OPPORTUNITY
    // =====================================================

    const handleDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);

            await api.delete(
                `/admin/opportunities/${deleteTarget.id}`
            );

            setOpportunities((current) =>
                current.filter(
                    (item) => item.id !== deleteTarget.id
                )
            );

            if (
                selectedOpportunity?.id ===
                deleteTarget.id
            ) {
                setSelectedOpportunity(null);
            }

            setDeleteTarget(null);
        } catch (err) {
            console.error("Delete failed:", err);

            alert(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to delete opportunity."
            );
        } finally {
            setDeleting(false);
        }
    };

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setTypeFilter("ALL");
        setWorkModeFilter("ALL");
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "Not specified";
        }

        try {
            return new Date(date).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );
        } catch {
            return date;
        }
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "PUBLISHED":
                return "status-published";

            case "DRAFT":
                return "status-draft";

            case "CLOSED":
                return "status-closed";

            default:
                return "status-default";
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="admin-opportunities-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-opportunities-header">

                <div>
                    <button
                        className="admin-back-button"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>Opportunity Management</h1>

                    <p>
                        Monitor and manage all opportunities
                        published on Nexly.
                    </p>
                </div>

            </div>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="admin-opportunity-stats">

                <div className="admin-opportunity-stat-card">
                    <div className="stat-icon total">
                        💼
                    </div>

                    <div>
                        <span>Total Opportunities</span>
                        <strong>{totalOpportunities}</strong>
                    </div>
                </div>

                <div className="admin-opportunity-stat-card">
                    <div className="stat-icon published">
                        ✓
                    </div>

                    <div>
                        <span>Published</span>
                        <strong>{publishedCount}</strong>
                    </div>
                </div>

                <div className="admin-opportunity-stat-card">
                    <div className="stat-icon draft">
                        📝
                    </div>

                    <div>
                        <span>Drafts</span>
                        <strong>{draftCount}</strong>
                    </div>
                </div>

                <div className="admin-opportunity-stat-card">
                    <div className="stat-icon closed">
                        🔒
                    </div>

                    <div>
                        <span>Closed</span>
                        <strong>{closedCount}</strong>
                    </div>
                </div>

            </div>

            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="admin-opportunity-filters">

                <div className="opportunity-search-box">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search by title, company or location..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="ALL">
                        All Status
                    </option>

                    <option value="PUBLISHED">
                        Published
                    </option>

                    <option value="DRAFT">
                        Draft
                    </option>

                    <option value="CLOSED">
                        Closed
                    </option>
                </select>

                <select
                    value={typeFilter}
                    onChange={(e) =>
                        setTypeFilter(e.target.value)
                    }
                >
                    <option value="ALL">
                        All Types
                    </option>

                    {types.map((type) => (
                        <option
                            key={type}
                            value={type}
                        >
                            {type}
                        </option>
                    ))}
                </select>

                <select
                    value={workModeFilter}
                    onChange={(e) =>
                        setWorkModeFilter(e.target.value)
                    }
                >
                    <option value="ALL">
                        All Work Modes
                    </option>

                    {workModes.map((mode) => (
                        <option
                            key={mode}
                            value={mode}
                        >
                            {mode}
                        </option>
                    ))}
                </select>

                <button
                    className="reset-filter-button"
                    onClick={resetFilters}
                >
                    Reset
                </button>

            </div>

            {/* =================================================
                RESULT COUNT
            ================================================= */}

            {!loading && !error && (
                <div className="opportunity-result-count">
                    Showing{" "}
                    <strong>
                        {filteredOpportunities.length}
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {opportunities.length}
                    </strong>{" "}
                    opportunities
                </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="admin-opportunity-error">
                    <strong>Unable to load opportunities</strong>
                    <span>{error}</span>

                    <button onClick={loadOpportunities}>
                        Try Again
                    </button>
                </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
                <div className="admin-opportunity-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading opportunities...</p>
                </div>
            )}

            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
                !error &&
                filteredOpportunities.length === 0 && (
                    <div className="admin-opportunity-empty">

                        <div className="empty-icon">
                            💼
                        </div>

                        <h2>No opportunities found</h2>

                        <p>
                            No opportunities match your
                            current search or filters.
                        </p>

                        <button
                            onClick={resetFilters}
                        >
                            Clear Filters
                        </button>

                    </div>
                )}

            {/* =================================================
                OPPORTUNITY GRID
            ================================================= */}

            {!loading &&
                !error &&
                filteredOpportunities.length > 0 && (

                    <div className="admin-opportunity-grid">

                        {filteredOpportunities.map(
                            (opportunity) => (

                                <div
                                    className="admin-opportunity-card"
                                    key={opportunity.id}
                                >

                                    <div className="opportunity-card-top">

                                        <div className="company-avatar">
                                            {opportunity.companyName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "N"}
                                        </div>

                                        <span
                                            className={`opportunity-status ${getStatusClass(
                                                opportunity.status
                                            )}`}
                                        >
                                            {opportunity.status ||
                                                "UNKNOWN"}
                                        </span>

                                    </div>

                                    <h2>
                                        {opportunity.title}
                                    </h2>

                                    <p className="opportunity-company">
                                        {opportunity.companyName ||
                                            "Unknown Company"}
                                    </p>

                                    <div className="opportunity-meta">

                                        <span>
                                            📍{" "}
                                            {opportunity.location ||
                                                "Not specified"}
                                        </span>

                                        <span>
                                            💼{" "}
                                            {opportunity.type ||
                                                "Not specified"}
                                        </span>

                                        <span>
                                            🏠{" "}
                                            {opportunity.workMode ||
                                                "Not specified"}
                                        </span>

                                    </div>

                                    <div className="opportunity-deadline">

                                        <span>
                                            Application Deadline
                                        </span>

                                        <strong>
                                            {formatDate(
                                                opportunity.applicationDeadline
                                            )}
                                        </strong>

                                    </div>

                                    <div className="opportunity-card-actions">

                                        <button
                                            className="view-opportunity-button"
                                            onClick={() =>
                                                setSelectedOpportunity(
                                                    opportunity
                                                )
                                            }
                                        >
                                            View Details
                                        </button>

                                        <button
                                            className="delete-opportunity-button"
                                            onClick={() =>
                                                setDeleteTarget(
                                                    opportunity
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            {/* =================================================
                VIEW DETAILS MODAL
            ================================================= */}

            {selectedOpportunity && (
                <div
                    className="admin-modal-overlay"
                    onClick={() =>
                        setSelectedOpportunity(null)
                    }
                >

                    <div
                        className="admin-opportunity-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>
                                <span className="modal-label">
                                    OPPORTUNITY DETAILS
                                </span>

                                <h2>
                                    {selectedOpportunity.title}
                                </h2>

                                <p>
                                    {selectedOpportunity.companyName ||
                                        "Unknown Company"}
                                </p>
                            </div>

                            <button
                                className="modal-close-button"
                                onClick={() =>
                                    setSelectedOpportunity(null)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="modal-status-row">

                            <span
                                className={`opportunity-status ${getStatusClass(
                                    selectedOpportunity.status
                                )}`}
                            >
                                {selectedOpportunity.status}
                            </span>

                        </div>

                        <div className="modal-details-grid">

                            <div>
                                <span>Opportunity Type</span>
                                <strong>
                                    {selectedOpportunity.type ||
                                        "Not specified"}
                                </strong>
                            </div>

                            <div>
                                <span>Work Mode</span>
                                <strong>
                                    {selectedOpportunity.workMode ||
                                        "Not specified"}
                                </strong>
                            </div>

                            <div>
                                <span>Location</span>
                                <strong>
                                    {selectedOpportunity.location ||
                                        "Not specified"}
                                </strong>
                            </div>

                            <div>
                                <span>Application Deadline</span>
                                <strong>
                                    {formatDate(
                                        selectedOpportunity.applicationDeadline
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="modal-section">

                            <h3>Description</h3>

                            <p>
                                {selectedOpportunity.description ||
                                    "No description provided."}
                            </p>

                        </div>

                        <div className="modal-actions">

                            <button
                                className="modal-secondary-button"
                                onClick={() =>
                                    setSelectedOpportunity(null)
                                }
                            >
                                Close
                            </button>

                            <button
                                className="modal-delete-button"
                                onClick={() => {
                                    setDeleteTarget(
                                        selectedOpportunity
                                    );

                                    setSelectedOpportunity(null);
                                }}
                            >
                                Delete Opportunity
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            {deleteTarget && (
                <div
                    className="admin-modal-overlay"
                    onClick={() =>
                        !deleting &&
                        setDeleteTarget(null)
                    }
                >

                    <div
                        className="delete-confirmation-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="delete-warning-icon">
                            ⚠
                        </div>

                        <h2>
                            Delete Opportunity?
                        </h2>

                        <p>
                            Are you sure you want to delete
                            <strong>
                                {" "}
                                {deleteTarget.title}
                            </strong>
                            ?
                        </p>

                        <p className="delete-warning-text">
                            This action cannot be undone.
                        </p>

                        <div className="delete-modal-actions">

                            <button
                                className="cancel-delete-button"
                                disabled={deleting}
                                onClick={() =>
                                    setDeleteTarget(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-button"
                                disabled={deleting}
                                onClick={handleDelete}
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminOpportunities;