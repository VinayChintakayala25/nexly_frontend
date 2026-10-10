import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/recruiter/dashboard"
            );

            setDashboard(response.data);

        } catch (err) {
            console.error(
                "Recruiter dashboard error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load recruiter dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="recruiter-dashboard-page">

                <div className="recruiter-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading recruiter dashboard...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="recruiter-dashboard-page">

                <div className="recruiter-error">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={loadDashboard}
                        className="retry-button"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() =>
                            navigate("/recruiter/company")
                        }
                        className="outline-button"
                    >
                        Manage Company Profile
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="recruiter-dashboard-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="recruiter-page-header">

                <div>

                    <span className="page-label">
                        RECRUITER PORTAL
                    </span>

                    <h1>
                        Recruiter Dashboard
                    </h1>

                    <p>
                        Manage opportunities, applicants,
                        interviews and hiring activity.
                    </p>

                </div>

                <button
                    className="create-opportunity-button"
                    onClick={() =>
                        navigate(
                            "/recruiter/opportunities/create"
                        )
                    }
                >
                    + Create Opportunity
                </button>

            </div>


            {/* =================================================
                COMPANY SUMMARY
            ================================================= */}

            <div className="company-summary-card">

                <div className="company-avatar">
                    C
                </div>

                <div className="company-summary-content">

                    <h2>
                        Your Company
                    </h2>

                    <p>
                        Recruiter account
                    </p>

                </div>

                <button
                    className="outline-button"
                    onClick={() =>
                        navigate(
                            "/recruiter/company"
                        )
                    }
                >
                    Manage Company
                </button>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="recruiter-stat-grid">

                {/* ACTIVE OPPORTUNITIES */}

                <div className="recruiter-stat-card">

                    <div className="stat-card-top">

                        <span>
                            Active Opportunities
                        </span>

                        <span className="stat-icon blue">
                            ◈
                        </span>

                    </div>

                    <h2>
                        {dashboard?.publishedOpportunities ?? 0}
                    </h2>

                    <p>
                        Currently accepting candidates
                    </p>

                </div>


                {/* TOTAL APPLICANTS */}

                <div className="recruiter-stat-card">

                    <div className="stat-card-top">

                        <span>
                            Total Applicants
                        </span>

                        <span className="stat-icon purple">
                            ◉
                        </span>

                    </div>

                    <h2>
                        {dashboard?.totalApplications ?? 0}
                    </h2>

                    <p>
                        Candidates across opportunities
                    </p>

                </div>


                {/* SHORTLISTED */}

                <div className="recruiter-stat-card">

                    <div className="stat-card-top">

                        <span>
                            Shortlisted
                        </span>

                        <span className="stat-icon green">
                            ✓
                        </span>

                    </div>

                    <h2>
                        {dashboard?.shortlisted ?? 0}
                    </h2>

                    <p>
                        Candidates shortlisted
                    </p>

                </div>


                {/* INTERVIEWS */}

                <div className="recruiter-stat-card">

                    <div className="stat-card-top">

                        <span>
                            Interviews
                        </span>

                        <span className="stat-icon orange">
                            ◷
                        </span>

                    </div>

                    <h2>
                        {dashboard?.interviews ?? 0}
                    </h2>

                    <p>
                        Candidate interviews
                    </p>

                </div>

            </div>


            {/* =================================================
                ADDITIONAL STATUS SUMMARY
            ================================================= */}

            <div className="recruiter-stat-grid">

                <div className="recruiter-stat-card">

                    <div className="stat-card-top">

                        <span>
                            Total Opportunities
                        </span>

                        <span className="stat-icon blue">
                            ◆
                        </span>

                    </div>

                    <h2>
                        {dashboard?.totalOpportunities ?? 0}
                    </h2>

                    <p>
                        Opportunities created
                    </p>

                </div>


                <div className="recruiter-stat-card">

                    <div className="stat-card-top">

                        <span>
                            Under Review
                        </span>

                        <span className="stat-icon orange">
                            ◌
                        </span>

                    </div>

                    <h2>
                        {dashboard?.underReview ?? 0}
                    </h2>

                    <p>
                        Applications under review
                    </p>

                </div>


                <div className="recruiter-stat-card">

                    <div className="stat-card-top">

                        <span>
                            Selected
                        </span>

                        <span className="stat-icon green">
                            ✓
                        </span>

                    </div>

                    <h2>
                        {dashboard?.selected ?? 0}
                    </h2>

                    <p>
                        Successfully selected
                    </p>

                </div>


                <div className="recruiter-stat-card">

                    <div className="stat-card-top">

                        <span>
                            Notifications
                        </span>

                        <span className="stat-icon purple">
                            🔔
                        </span>

                    </div>

                    <h2>
                        {dashboard?.unreadNotifications ?? 0}
                    </h2>

                    <p>
                        Unread notifications
                    </p>

                </div>

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Manage your recruitment workflow.
                        </p>

                    </div>

                </div>


                <div className="quick-action-grid">

                    {/* CREATE */}

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            navigate(
                                "/recruiter/opportunities/create"
                            )
                        }
                    >

                        <span className="quick-action-icon">
                            +
                        </span>

                        <div>

                            <h3>
                                Create Opportunity
                            </h3>

                            <p>
                                Publish a new job,
                                internship or project.
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>


                    {/* MANAGE OPPORTUNITIES */}

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            navigate(
                                "/recruiter/opportunities"
                            )
                        }
                    >

                        <span className="quick-action-icon">
                            ◈
                        </span>

                        <div>

                            <h3>
                                Manage Opportunities
                            </h3>

                            <p>
                                View and manage your
                                published opportunities.
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>


                    {/* APPLICATIONS */}

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            navigate(
                                "/recruiter/applications"
                            )
                        }
                    >

                        <span className="quick-action-icon">
                            ◉
                        </span>

                        <div>

                            <h3>
                                View Applications
                            </h3>

                            <p>
                                Review candidates and
                                update application status.
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>


                    {/* INTERVIEWS */}

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            navigate(
                                "/recruiter/interviews"
                            )
                        }
                    >

                        <span className="quick-action-icon">
                            ◷
                        </span>

                        <div>

                            <h3>
                                Interviews
                            </h3>

                            <p>
                                Manage upcoming candidate
                                interviews.
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>

                </div>

            </section>


            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Recent Activity
                        </h2>

                        <p>
                            Latest recruitment activity.
                        </p>

                    </div>

                </div>


                <div className="activity-card">

                    <div className="empty-activity">

                        <div className="empty-icon">
                            ◌
                        </div>

                        <h3>
                            Recruitment activity
                        </h3>

                        <p>
                            New applications, shortlists,
                            selections and interviews will
                            appear here.
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default RecruiterDashboard;