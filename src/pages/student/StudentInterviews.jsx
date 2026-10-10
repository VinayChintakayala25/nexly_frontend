import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "./StudentInterviews.css";

function StudentInterviews() {
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

            const response =
                await api.get("/interviews/student");

            setInterviews(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load interviews."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) {
            return "Date not specified";
        }

        const date = new Date(dateTime);

        if (Number.isNaN(date.getTime())) {
            return "Date not specified";
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getModeLabel = (mode) => {
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

    const getStatusClass = (status) => {
        if (!status) {
            return "scheduled";
        }

        return status
            .toLowerCase()
            .replaceAll("_", "-");
    };

    const getOpportunityTitle = (interview) => {
        return (
            interview.application?.opportunity?.title ||
            interview.opportunity?.title ||
            "Interview"
        );
    };

    const getCompanyName = (interview) => {
        return (
            interview.application?.opportunity?.company
                ?.companyName ||
            interview.opportunity?.company?.companyName ||
            "Company"
        );
    };

    const upcomingInterviews = interviews.filter(
        (interview) => {
            if (!interview.interviewDateTime) {
                return false;
            }

            const interviewDate =
                new Date(
                    interview.interviewDateTime
                );

            return (
                !Number.isNaN(interviewDate.getTime()) &&
                interviewDate >= new Date()
            );
        }
    );

    const pastInterviews = interviews.filter(
        (interview) => {
            if (!interview.interviewDateTime) {
                return false;
            }

            const interviewDate =
                new Date(
                    interview.interviewDateTime
                );

            return (
                !Number.isNaN(interviewDate.getTime()) &&
                interviewDate < new Date()
            );
        }
    );

    return (
        <div className="student-interviews-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="interviews-header">

                <div>
                    <span className="interviews-eyebrow">
                        YOUR CAREER JOURNEY
                    </span>

                    <h1>
                        Interviews
                    </h1>

                    <p>
                        View and manage your scheduled
                        interviews in one place.
                    </p>
                </div>

                <div className="interview-summary">

                    <div className="interview-summary-card">
                        <strong>
                            {upcomingInterviews.length}
                        </strong>

                        <span>
                            Upcoming
                        </span>
                    </div>

                    <div className="interview-summary-card">
                        <strong>
                            {pastInterviews.length}
                        </strong>

                        <span>
                            Completed
                        </span>
                    </div>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="interviews-error">

                    <span>
                        ⚠
                    </span>

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


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="interviews-loading">
                    <Loading />
                </div>

            ) : interviews.length === 0 ? (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div className="interviews-empty">

                    <div className="interviews-empty-icon">
                        ◷
                    </div>

                    <h2>
                        No interviews scheduled
                    </h2>

                    <p>
                        When a recruiter schedules an
                        interview for one of your
                        applications, it will appear here.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/student/applications"
                            )
                        }
                    >
                        View Applications
                    </button>

                </div>

            ) : (

                <div className="interviews-content">

                    {/* =================================================
                        UPCOMING
                    ================================================= */}

                    {upcomingInterviews.length > 0 && (
                        <section className="interviews-section">

                            <div className="section-heading">

                                <div>
                                    <h2>
                                        Upcoming Interviews
                                    </h2>

                                    <p>
                                        Your scheduled
                                        interviews
                                    </p>
                                </div>

                                <span>
                                    {upcomingInterviews.length}
                                </span>

                            </div>


                            <div className="interviews-grid">

                                {upcomingInterviews.map(
                                    (interview) => (

                                        <article
                                            key={interview.id}
                                            className="interview-card upcoming"
                                        >

                                            {/* TOP */}

                                            <div className="interview-card-top">

                                                <div className="interview-icon">
                                                    ◷
                                                </div>

                                                <span
                                                    className={`interview-status ${getStatusClass(
                                                        interview.status
                                                    )}`}
                                                >
                                                    {interview.status ||
                                                        "SCHEDULED"}
                                                </span>

                                            </div>


                                            {/* TITLE */}

                                            <h3>
                                                {getOpportunityTitle(
                                                    interview
                                                )}
                                            </h3>

                                            <p className="interview-company">
                                                {getCompanyName(
                                                    interview
                                                )}
                                            </p>


                                            {/* DATE */}

                                            <div className="interview-detail">

                                                <span>
                                                    📅
                                                </span>

                                                <div>
                                                    <small>
                                                        Date & Time
                                                    </small>

                                                    <strong>
                                                        {formatDateTime(
                                                            interview.interviewDateTime
                                                        )}
                                                    </strong>
                                                </div>

                                            </div>


                                            {/* MODE */}

                                            <div className="interview-detail">

                                                <span>
                                                    💻
                                                </span>

                                                <div>
                                                    <small>
                                                        Interview Mode
                                                    </small>

                                                    <strong>
                                                        {getModeLabel(
                                                            interview.mode
                                                        )}
                                                    </strong>
                                                </div>

                                            </div>


                                            {/* MEETING */}

                                            {interview.meetingLink && (
                                                <a
                                                    className="join-interview-button"
                                                    href={
                                                        interview.meetingLink
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Join Interview →
                                                </a>
                                            )}


                                            {/* NOTES */}

                                            {interview.notes && (
                                                <div className="interview-notes">

                                                    <strong>
                                                        Notes
                                                    </strong>

                                                    <p>
                                                        {
                                                            interview.notes
                                                        }
                                                    </p>

                                                </div>
                                            )}

                                        </article>
                                    )
                                )}

                            </div>

                        </section>
                    )}


                    {/* =================================================
                        PAST
                    ================================================= */}

                    {pastInterviews.length > 0 && (
                        <section className="interviews-section past-section">

                            <div className="section-heading">

                                <div>
                                    <h2>
                                        Previous Interviews
                                    </h2>

                                    <p>
                                        Your interview history
                                    </p>
                                </div>

                                <span>
                                    {pastInterviews.length}
                                </span>

                            </div>


                            <div className="interviews-grid">

                                {pastInterviews.map(
                                    (interview) => (

                                        <article
                                            key={interview.id}
                                            className="interview-card past"
                                        >

                                            <div className="interview-card-top">

                                                <div className="interview-icon">
                                                    ✓
                                                </div>

                                                <span
                                                    className={`interview-status ${getStatusClass(
                                                        interview.status
                                                    )}`}
                                                >
                                                    {interview.status ||
                                                        "COMPLETED"}
                                                </span>

                                            </div>


                                            <h3>
                                                {getOpportunityTitle(
                                                    interview
                                                )}
                                            </h3>

                                            <p className="interview-company">
                                                {getCompanyName(
                                                    interview
                                                )}
                                            </p>


                                            <div className="interview-detail">

                                                <span>
                                                    📅
                                                </span>

                                                <div>
                                                    <small>
                                                        Date & Time
                                                    </small>

                                                    <strong>
                                                        {formatDateTime(
                                                            interview.interviewDateTime
                                                        )}
                                                    </strong>
                                                </div>

                                            </div>


                                            <div className="interview-detail">

                                                <span>
                                                    💻
                                                </span>

                                                <div>
                                                    <small>
                                                        Interview Mode
                                                    </small>

                                                    <strong>
                                                        {getModeLabel(
                                                            interview.mode
                                                        )}
                                                    </strong>
                                                </div>

                                            </div>

                                        </article>
                                    )
                                )}

                            </div>

                        </section>
                    )}

                </div>
            )}

        </div>
    );
}

export default StudentInterviews;