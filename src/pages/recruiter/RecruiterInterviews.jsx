import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "./RecruiterInterviews.css";

function RecruiterInterviews() {
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadInterviews();
    }, []);

    const loadInterviews = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/interviews/recruiter");

            setInterviews(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error(
                "Recruiter interviews error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load interviews."
            );
        } finally {
            setLoading(false);
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

    const formatTime = (date) => {
        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const formatMode = (mode) => {
        if (!mode) {
            return "Not specified";
        }

        return mode
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const getStudentName = (interview) => {
        return (
            interview?.application?.student?.name ||
            interview?.application?.studentName ||
            "Candidate"
        );
    };

    const getStudentEmail = (interview) => {
        return (
            interview?.application?.student?.email ||
            interview?.application?.studentEmail ||
            "Email unavailable"
        );
    };

    const getOpportunityTitle = (interview) => {
        return (
            interview?.application?.opportunity?.title ||
            interview?.application?.opportunityTitle ||
            "Opportunity"
        );
    };

    if (loading) {
        return (
            <div className="recruiter-interviews-page">
                <div className="recruiter-interviews-loading">
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="recruiter-interviews-page">

            {/* HEADER */}

            <div className="recruiter-interviews-header">

                <div>
                    <span className="interviews-eyebrow">
                        RECRUITER PORTAL
                    </span>

                    <h1>
                        Interviews
                    </h1>

                    <p>
                        Manage scheduled candidate interviews
                        and upcoming hiring conversations.
                    </p>
                </div>

                <button
                    className="interviews-dashboard-button"
                    onClick={() =>
                        navigate("/recruiter")
                    }
                >
                    ← Dashboard
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="recruiter-interviews-error">

                    <span>⚠</span>

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={loadInterviews}
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* SUMMARY */}

            <div className="interview-summary-grid">

                <div className="interview-summary-card">
                    <span>
                        Total Interviews
                    </span>

                    <strong>
                        {interviews.length}
                    </strong>
                </div>

                <div className="interview-summary-card">
                    <span>
                        Scheduled
                    </span>

                    <strong>
                        {
                            interviews.filter(
                                (interview) =>
                                    interview.status ===
                                    "SCHEDULED"
                            ).length
                        }
                    </strong>
                </div>

                <div className="interview-summary-card">
                    <span>
                        Online
                    </span>

                    <strong>
                        {
                            interviews.filter(
                                (interview) =>
                                    interview.mode ===
                                    "ONLINE"
                            ).length
                        }
                    </strong>
                </div>

                <div className="interview-summary-card">
                    <span>
                        Offline
                    </span>

                    <strong>
                        {
                            interviews.filter(
                                (interview) =>
                                    interview.mode ===
                                    "OFFLINE"
                            ).length
                        }
                    </strong>
                </div>

            </div>


            {/* CONTENT */}

            {interviews.length === 0 ? (

                <div className="recruiter-interviews-empty">

                    <div className="interviews-empty-icon">
                        ◷
                    </div>

                    <h2>
                        No interviews scheduled
                    </h2>

                    <p>
                        Interviews you schedule for candidates
                        will appear here.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/recruiter/applications"
                            )
                        }
                    >
                        View Applications
                    </button>

                </div>

            ) : (

                <div className="recruiter-interviews-list">

                    {interviews.map((interview) => (

                        <article
                            className="recruiter-interview-card"
                            key={interview.id}
                        >

                            <div className="interview-date-box">

                                <strong>
                                    {new Date(
                                        interview.interviewDateTime
                                    ).getDate()}
                                </strong>

                                <span>
                                    {new Date(
                                        interview.interviewDateTime
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            month: "short",
                                        }
                                    )}
                                </span>

                            </div>


                            <div className="interview-main">

                                <div className="interview-title-row">

                                    <div>

                                        <h2>
                                            {getStudentName(
                                                interview
                                            )}
                                        </h2>

                                        <p>
                                            {getStudentEmail(
                                                interview
                                            )}
                                        </p>

                                    </div>

                                    <span
                                        className={`interview-status ${
                                            interview.status ===
                                            "SCHEDULED"
                                                ? "scheduled"
                                                : "other"
                                        }`}
                                    >
                                        {interview.status ||
                                            "SCHEDULED"}
                                    </span>

                                </div>


                                <div className="interview-opportunity">

                                    <strong>
                                        {getOpportunityTitle(
                                            interview
                                        )}
                                    </strong>

                                </div>


                                <div className="interview-meta">

                                    <span>
                                        📅{" "}
                                        {formatDate(
                                            interview.interviewDateTime
                                        )}
                                    </span>

                                    <span>
                                        🕐{" "}
                                        {formatTime(
                                            interview.interviewDateTime
                                        )}
                                    </span>

                                    <span>
                                        💼{" "}
                                        {formatMode(
                                            interview.mode
                                        )}
                                    </span>

                                </div>


                                {interview.meetingLink && (
                                    <div className="interview-link">

                                        <span>
                                            Meeting:
                                        </span>

                                        <a
                                            href={
                                                interview.meetingLink
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Open Meeting
                                        </a>

                                    </div>
                                )}


                                {interview.notes && (
                                    <div className="interview-notes">

                                        <strong>
                                            Notes
                                        </strong>

                                        <p>
                                            {interview.notes}
                                        </p>

                                    </div>
                                )}

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </div>
    );
}

export default RecruiterInterviews;