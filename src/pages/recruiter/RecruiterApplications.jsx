import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./RecruiterApplications.css";

function RecruiterApplications() {

    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState("");
    const [applications, setApplications] = useState([]);

    const [loadingOpportunities, setLoadingOpportunities] = useState(true);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadOpportunities();
    }, []);

    const loadOpportunities = async () => {

        try {

            setLoadingOpportunities(true);
            setError("");

            const response = await api.get(
                "/recruiter/opportunities"
            );

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setOpportunities(data);

            if (data.length > 0) {
                setSelectedOpportunity(String(data[0].id));
                loadApplications(data[0].id);
            }

        } catch (err) {

            console.error(
                "Load opportunities error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to load opportunities."
            );

        } finally {

            setLoadingOpportunities(false);
        }
    };

    const loadApplications = async (opportunityId) => {

        if (!opportunityId) {
            setApplications([]);
            return;
        }

        try {

            setLoadingApplications(true);
            setError("");
            setSuccess("");

            const response = await api.get(
                `/applications/opportunity/${opportunityId}`
            );

            setApplications(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Load applications error:",
                err
            );

            setApplications([]);

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to load applications."
            );

        } finally {

            setLoadingApplications(false);
        }
    };

    const handleOpportunityChange = (event) => {

        const opportunityId = event.target.value;

        setSelectedOpportunity(opportunityId);

        loadApplications(opportunityId);
    };

    const updateStatus = async (applicationId, status) => {

        try {

            setUpdatingId(applicationId);
            setError("");
            setSuccess("");

            await api.put(
                `/applications/${applicationId}/status`,
                null,
                {
                    params: {
                        status: status
                    }
                }
            );

            setApplications((previous) =>
                previous.map((application) =>
                    application.id === applicationId
                        ? {
                            ...application,
                            status: status
                        }
                        : application
                )
            );

            setSuccess(
                `Application status updated to ${formatStatus(status)}.`
            );

        } catch (err) {

            console.error(
                "Update application status error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to update application status."
            );

        } finally {

            setUpdatingId(null);
        }
    };

    const formatStatus = (status) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .toLowerCase()
            .replaceAll("_", " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "SELECTED":
                return "status-selected";

            case "SHORTLISTED":
                return "status-shortlisted";

            case "INTERVIEW_SCHEDULED":
                return "status-interview";

            case "REJECTED":
                return "status-rejected";

            case "UNDER_REVIEW":
                return "status-review";

            default:
                return "status-applied";
        }
    };

    const getStudentName = (application) => {

        return (
            application?.student?.name ||
            "Student"
        );
    };

    const getStudentEmail = (application) => {

        return (
            application?.student?.email ||
            "No email available"
        );
    };

    const getOpportunityTitle = () => {

        const opportunity = opportunities.find(
            (item) =>
                String(item.id) ===
                String(selectedOpportunity)
        );

        return opportunity?.title || "Opportunity";
    };

    return (
        <div className="recruiter-applications-page">

            {/* HEADER */}

            <div className="applications-header">

                <div>

                    <span className="applications-eyebrow">
                        RECRUITER PORTAL
                    </span>

                    <h1>
                        Applications
                    </h1>

                    <p>
                        Review candidates and manage their
                        application status.
                    </p>

                </div>

                <button
                    className="applications-back-button"
                    onClick={() => navigate("/recruiter")}
                >
                    ← Dashboard
                </button>

            </div>


            {/* SELECT OPPORTUNITY */}

            <div className="applications-control-card">

                <div>

                    <span className="control-label">
                        SELECT OPPORTUNITY
                    </span>

                    <h2>
                        Candidate Applications
                    </h2>

                </div>

                <select
                    value={selectedOpportunity}
                    onChange={handleOpportunityChange}
                    disabled={
                        loadingOpportunities ||
                        opportunities.length === 0
                    }
                >

                    {opportunities.length === 0 ? (
                        <option value="">
                            No opportunities available
                        </option>
                    ) : (
                        opportunities.map((opportunity) => (
                            <option
                                key={opportunity.id}
                                value={opportunity.id}
                            >
                                {opportunity.title}
                            </option>
                        ))
                    )}

                </select>

            </div>


            {/* SUCCESS */}

            {success && (
                <div className="applications-success">
                    <span>✓</span>
                    <p>{success}</p>
                </div>
            )}


            {/* ERROR */}

            {error && (
                <div className="applications-error">
                    <span>!</span>
                    <p>{error}</p>

                    <button
                        onClick={() => {
                            setError("");
                            if (selectedOpportunity) {
                                loadApplications(
                                    selectedOpportunity
                                );
                            }
                        }}
                    >
                        Retry
                    </button>

                </div>
            )}


            {/* SUMMARY */}

            {!loadingApplications &&
                selectedOpportunity && (
                    <div className="application-summary">

                        <div className="summary-card">

                            <span>
                                Total Applicants
                            </span>

                            <strong>
                                {applications.length}
                            </strong>

                        </div>

                        <div className="summary-card">

                            <span>
                                Under Review
                            </span>

                            <strong>
                                {
                                    applications.filter(
                                        (item) =>
                                            item.status ===
                                            "UNDER_REVIEW"
                                    ).length
                                }
                            </strong>

                        </div>

                        <div className="summary-card">

                            <span>
                                Shortlisted
                            </span>

                            <strong>
                                {
                                    applications.filter(
                                        (item) =>
                                            item.status ===
                                            "SHORTLISTED"
                                    ).length
                                }
                            </strong>

                        </div>

                        <div className="summary-card">

                            <span>
                                Selected
                            </span>

                            <strong>
                                {
                                    applications.filter(
                                        (item) =>
                                            item.status ===
                                            "SELECTED"
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>
                )}


            {/* CONTENT */}

            <div className="applications-content">

                {loadingApplications ? (

                    <div className="applications-loading">

                        <div className="applications-spinner" />

                        <p>
                            Loading candidate applications...
                        </p>

                    </div>

                ) : applications.length === 0 ? (

                    <div className="applications-empty">

                        <div className="empty-icon">
                            ◌
                        </div>

                        <h2>
                            No applications yet
                        </h2>

                        <p>
                            Candidates who apply for{" "}
                            <strong>
                                {getOpportunityTitle()}
                            </strong>{" "}
                            will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="applications-list">

                        {applications.map((application) => (

                            <div
                                className="application-card"
                                key={application.id}
                            >

                                {/* STUDENT */}

                                <div className="candidate-info">

                                    <div className="candidate-avatar">
                                        {getStudentName(
                                            application
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>

                                        <h3>
                                            {getStudentName(
                                                application
                                            )}
                                        </h3>

                                        <p>
                                            {
                                                getStudentEmail(
                                                    application
                                                )
                                            }
                                        </p>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="application-status">

                                    <span className="status-label">
                                        CURRENT STATUS
                                    </span>

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            application.status
                                        )}`}
                                    >
                                        {formatStatus(
                                            application.status
                                        )}
                                    </span>

                                </div>


                                {/* DETAILS */}

                                <div className="application-details">

                                    {application.coverLetter && (
                                        <div className="detail-block">

                                            <span>
                                                Cover Letter
                                            </span>

                                            <p>
                                                {
                                                    application.coverLetter
                                                }
                                            </p>

                                        </div>
                                    )}

                                    {application.resumeUrl && (
                                        <div className="detail-block">

                                            <span>
                                                Resume
                                            </span>

                                            <a
                                                href={
                                                    application.resumeUrl
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View Resume →
                                            </a>

                                        </div>
                                    )}

                                </div>


                                {/* ACTIONS */}

                                <div className="application-actions">

                                    <span className="action-label">
                                        UPDATE STATUS
                                    </span>

                                    <div className="status-actions">

                                        <button
                                            className="review-button"
                                            disabled={
                                                updatingId ===
                                                application.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    application.id,
                                                    "UNDER_REVIEW"
                                                )
                                            }
                                        >
                                            Review
                                        </button>

                                        <button
                                            className="shortlist-button"
                                            disabled={
                                                updatingId ===
                                                application.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    application.id,
                                                    "SHORTLISTED"
                                                )
                                            }
                                        >
                                            Shortlist
                                        </button>

                                        <button
                                            className="interview-button"
                                            disabled={
                                                updatingId ===
                                                application.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    application.id,
                                                    "INTERVIEW_SCHEDULED"
                                                )
                                            }
                                        >
                                            Interview
                                        </button>

                                        <button
                                            className="select-button"
                                            disabled={
                                                updatingId ===
                                                application.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    application.id,
                                                    "SELECTED"
                                                )
                                            }
                                        >
                                            Select
                                        </button>

                                        <button
                                            className="reject-button"
                                            disabled={
                                                updatingId ===
                                                application.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    application.id,
                                                    "REJECTED"
                                                )
                                            }
                                        >
                                            Reject
                                        </button>

                                    </div>

                                    {updatingId ===
                                        application.id && (
                                        <span className="updating-text">
                                            Updating...
                                        </span>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default RecruiterApplications;