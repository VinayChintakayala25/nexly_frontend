import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminApplications.css";

function AdminApplications() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedApplication, setSelectedApplication] = useState(null);

    // =====================================================
    // LOAD APPLICATIONS
    // =====================================================

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/applications");

            setApplications(response.data);
        } catch (err) {
            console.error("Failed to load applications:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to load applications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, []);

    // =====================================================
    // FILTERED APPLICATIONS
    // =====================================================

    const filteredApplications = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return applications.filter((application) => {
            const matchesSearch =
                !searchText ||
                application.studentName
                    ?.toLowerCase()
                    .includes(searchText) ||
                application.studentEmail
                    ?.toLowerCase()
                    .includes(searchText) ||
                application.opportunityTitle
                    ?.toLowerCase()
                    .includes(searchText) ||
                application.companyName
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "ALL" ||
                application.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [applications, search, statusFilter]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalApplications = applications.length;

    const appliedCount = applications.filter(
        (item) => item.status === "APPLIED"
    ).length;

    const underReviewCount = applications.filter(
        (item) => item.status === "UNDER_REVIEW"
    ).length;

    const shortlistedCount = applications.filter(
        (item) => item.status === "SHORTLISTED"
    ).length;

    const selectedCount = applications.filter(
        (item) => item.status === "SELECTED"
    ).length;

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "APPLIED":
                return "application-status-applied";

            case "UNDER_REVIEW":
                return "application-status-review";

            case "SHORTLISTED":
                return "application-status-shortlisted";

            case "INTERVIEW_SCHEDULED":
                return "application-status-interview";

            case "SELECTED":
                return "application-status-selected";

            case "REJECTED":
                return "application-status-rejected";

            case "WITHDRAWN":
                return "application-status-withdrawn";

            default:
                return "application-status-default";
        }
    };

    // =====================================================
    // FORMAT STATUS
    // =====================================================

    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return status
            .toLowerCase()
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
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
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="admin-applications-page">

            {/* HEADER */}

            <div className="admin-applications-header">

                <div>
                    <button
                        className="admin-applications-back"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>Application Management</h1>

                    <p>
                        Monitor student applications across
                        all Nexly opportunities.
                    </p>
                </div>

            </div>

            {/* STATS */}

            <div className="admin-application-stats">

                <div className="admin-application-stat">
                    <div className="application-stat-icon total">
                        📄
                    </div>

                    <div>
                        <span>Total Applications</span>
                        <strong>{totalApplications}</strong>
                    </div>
                </div>

                <div className="admin-application-stat">
                    <div className="application-stat-icon applied">
                        📨
                    </div>

                    <div>
                        <span>Applied</span>
                        <strong>{appliedCount}</strong>
                    </div>
                </div>

                <div className="admin-application-stat">
                    <div className="application-stat-icon review">
                        🔍
                    </div>

                    <div>
                        <span>Under Review</span>
                        <strong>{underReviewCount}</strong>
                    </div>
                </div>

                <div className="admin-application-stat">
                    <div className="application-stat-icon shortlisted">
                        ⭐
                    </div>

                    <div>
                        <span>Shortlisted</span>
                        <strong>{shortlistedCount}</strong>
                    </div>
                </div>

                <div className="admin-application-stat">
                    <div className="application-stat-icon selected">
                        ✓
                    </div>

                    <div>
                        <span>Selected</span>
                        <strong>{selectedCount}</strong>
                    </div>
                </div>

            </div>

            {/* FILTERS */}

            <div className="admin-application-filters">

                <div className="admin-application-search">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search student, opportunity or company..."
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

                    <option value="APPLIED">
                        Applied
                    </option>

                    <option value="UNDER_REVIEW">
                        Under Review
                    </option>

                    <option value="SHORTLISTED">
                        Shortlisted
                    </option>

                    <option value="INTERVIEW_SCHEDULED">
                        Interview Scheduled
                    </option>

                    <option value="SELECTED">
                        Selected
                    </option>

                    <option value="REJECTED">
                        Rejected
                    </option>

                    <option value="WITHDRAWN">
                        Withdrawn
                    </option>
                </select>

                <button
                    className="admin-application-reset"
                    onClick={resetFilters}
                >
                    Reset
                </button>

            </div>

            {/* RESULT COUNT */}

            {!loading && !error && (
                <div className="admin-application-result">
                    Showing{" "}
                    <strong>
                        {filteredApplications.length}
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {applications.length}
                    </strong>{" "}
                    applications
                </div>
            )}

            {/* ERROR */}

            {error && (
                <div className="admin-application-error">

                    <div>
                        <strong>
                            Unable to load applications
                        </strong>

                        <p>{error}</p>
                    </div>

                    <button onClick={loadApplications}>
                        Try Again
                    </button>

                </div>
            )}

            {/* LOADING */}

            {loading && (
                <div className="admin-application-loading">

                    <div className="application-spinner"></div>

                    <p>
                        Loading applications...
                    </p>

                </div>
            )}

            {/* EMPTY */}

            {!loading &&
                !error &&
                filteredApplications.length === 0 && (

                    <div className="admin-application-empty">

                        <div className="application-empty-icon">
                            📄
                        </div>

                        <h2>
                            No applications found
                        </h2>

                        <p>
                            No applications match your
                            current search or filter.
                        </p>

                        <button
                            onClick={resetFilters}
                        >
                            Clear Filters
                        </button>

                    </div>
                )}

            {/* APPLICATION TABLE */}

            {!loading &&
                !error &&
                filteredApplications.length > 0 && (

                    <div className="admin-application-table-wrapper">

                        <table className="admin-application-table">

                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Opportunity</th>
                                    <th>Company</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredApplications.map(
                                    (application) => (

                                        <tr
                                            key={
                                                application.id
                                            }
                                        >

                                            <td>
                                                <div className="admin-student-cell">

                                                    <div className="student-avatar">
                                                        {application.studentName
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "S"}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {application.studentName ||
                                                                "Unknown Student"}
                                                        </strong>

                                                        <span>
                                                            {application.studentEmail ||
                                                                "No email"}
                                                        </span>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                <strong>
                                                    {application.opportunityTitle ||
                                                        "Unknown Opportunity"}
                                                </strong>
                                            </td>

                                            <td>
                                                {application.companyName ||
                                                    "Unknown Company"}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    application.appliedAt ||
                                                    application.createdAt
                                                )}
                                            </td>

                                            <td>

                                                <span
                                                    className={`application-status ${getStatusClass(
                                                        application.status
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        application.status
                                                    )}
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="application-view-button"
                                                    onClick={() =>
                                                        setSelectedApplication(
                                                            application
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            {/* DETAILS MODAL */}

            {selectedApplication && (

                <div
                    className="admin-application-modal-overlay"
                    onClick={() =>
                        setSelectedApplication(null)
                    }
                >

                    <div
                        className="admin-application-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="application-modal-header">

                            <div>
                                <span>
                                    APPLICATION DETAILS
                                </span>

                                <h2>
                                    {selectedApplication.studentName ||
                                        "Unknown Student"}
                                </h2>

                                <p>
                                    {selectedApplication.studentEmail ||
                                        "No email available"}
                                </p>
                            </div>

                            <button
                                className="application-modal-close"
                                onClick={() =>
                                    setSelectedApplication(null)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="application-modal-status">

                            <span
                                className={`application-status ${getStatusClass(
                                    selectedApplication.status
                                )}`}
                            >
                                {formatStatus(
                                    selectedApplication.status
                                )}
                            </span>

                        </div>

                        <div className="application-details-grid">

                            <div>
                                <span>Opportunity</span>

                                <strong>
                                    {selectedApplication.opportunityTitle ||
                                        "Unknown"}
                                </strong>
                            </div>

                            <div>
                                <span>Company</span>

                                <strong>
                                    {selectedApplication.companyName ||
                                        "Unknown"}
                                </strong>
                            </div>

                            <div>
                                <span>Applied On</span>

                                <strong>
                                    {formatDate(
                                        selectedApplication.appliedAt ||
                                        selectedApplication.createdAt
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Application ID</span>

                                <strong>
                                    #{selectedApplication.id}
                                </strong>
                            </div>

                        </div>

                        {selectedApplication.coverLetter && (

                            <div className="application-modal-section">

                                <h3>
                                    Cover Letter
                                </h3>

                                <p>
                                    {
                                        selectedApplication.coverLetter
                                    }
                                </p>

                            </div>

                        )}

                        <div className="application-modal-actions">

                            <button
                                onClick={() =>
                                    setSelectedApplication(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminApplications;