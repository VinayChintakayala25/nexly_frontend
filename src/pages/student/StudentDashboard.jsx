import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loading from "../../components/Loading";

import "../../styles/student-dashboard.css";

function StudentDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        totalApplications: 0,
        underReview: 0,
        shortlisted: 0,
        selected: 0,
        rejected: 0,
        savedOpportunities: 0,
        upcomingInterviews: 0,
        unreadNotifications: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const savedUser = localStorage.getItem("nexly_user");

    let user = null;

    try {
        user = savedUser ? JSON.parse(savedUser) : null;
    } catch {
        user = null;
    }

    const userName =
        user?.name ||
        user?.username ||
        "Student";

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/student/dashboard");

                console.log(
                    "Student dashboard:",
                    response.data
                );

                setDashboard({
                    totalApplications:
                        response.data?.totalApplications ?? 0,

                    underReview:
                        response.data?.underReview ?? 0,

                    shortlisted:
                        response.data?.shortlisted ?? 0,

                    selected:
                        response.data?.selected ?? 0,

                    rejected:
                        response.data?.rejected ?? 0,

                    savedOpportunities:
                        response.data?.savedOpportunities ?? 0,

                    upcomingInterviews:
                        response.data?.upcomingInterviews ?? 0,

                    unreadNotifications:
                        response.data?.unreadNotifications ?? 0,
                });

            } catch (err) {

                console.error(
                    "===== DASHBOARD ERROR ====="
                );

                console.error(
                    "Status:",
                    err?.response?.status
                );

                console.error(
                    "Response:",
                    err?.response?.data
                );

                console.error(
                    "URL:",
                    err?.config?.url
                );

                console.error(
                    "Token exists:",
                    !!localStorage.getItem("nexly_token")
                );

                console.error(
                    "==========================="
                );

                setError(
                    err?.response?.data?.message ||
                    `Unable to load dashboard${
                        err?.response?.status
                            ? ` (${err.response.status})`
                            : ""
                    }.`
                );

            } finally {

                setLoading(false);
            }
        };

        loadDashboard();

    }, []);

    if (loading) {

        return (
            <DashboardLayout>

                <div className="dashboard-loading">

                    <div className="dashboard-spinner"></div>

                    <p>
                        Preparing your Nexly dashboard...
                    </p>

                </div>

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout
            notificationCount={
                dashboard.unreadNotifications
            }
        >

            <div className="student-dashboard">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="dashboard-header">

                    <div>

                        <div className="dashboard-eyebrow">
                            STUDENT WORKSPACE
                        </div>

                        <h1>
                            Welcome back, {userName} 👋
                        </h1>

                        <p className="dashboard-subtitle">
                            Track your opportunities,
                            applications and career progress
                            from one place.
                        </p>

                    </div>

                    <button
                        className="nexly-primary-btn"
                        onClick={() =>
                            navigate(
                                "/student/opportunities"
                            )
                        }
                    >
                        Discover Opportunities

                        <span className="btn-arrow">
                            →
                        </span>

                    </button>

                </div>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="dashboard-error">

                        ⚠️ {error}

                    </div>

                )}


                {/* =========================
                    MAIN STATISTICS
                ========================= */}

                <div className="stats-grid">

                    {/* Applications */}

                    <div className="stat-card">

                        <div className="stat-top">

                            <div className="stat-icon">
                                📄
                            </div>

                        </div>

                        <div className="stat-label">
                            Total Applications
                        </div>

                        <div className="stat-value">
                            {dashboard.totalApplications}
                        </div>

                        <div className="stat-description">
                            Applications submitted
                        </div>

                    </div>


                    {/* Under Review */}

                    <div className="stat-card">

                        <div className="stat-top">

                            <div className="stat-icon">
                                ◷
                            </div>

                        </div>

                        <div className="stat-label">
                            Under Review
                        </div>

                        <div className="stat-value">
                            {dashboard.underReview}
                        </div>

                        <div className="stat-description">
                            Currently being reviewed
                        </div>

                    </div>


                    {/* Shortlisted */}

                    <div className="stat-card">

                        <div className="stat-top">

                            <div className="stat-icon">
                                ◆
                            </div>

                        </div>

                        <div className="stat-label">
                            Shortlisted
                        </div>

                        <div className="stat-value">
                            {dashboard.shortlisted}
                        </div>

                        <div className="stat-description">
                            Applications shortlisted
                        </div>

                    </div>


                    {/* Selected */}

                    <div className="stat-card">

                        <div className="stat-top">

                            <div className="stat-icon">
                                ✓
                            </div>

                        </div>

                        <div className="stat-label">
                            Selected
                        </div>

                        <div className="stat-value">
                            {dashboard.selected}
                        </div>

                        <div className="stat-description">
                            Successful applications
                        </div>

                    </div>

                </div>


                {/* =========================
                    MINI STATISTICS
                ========================= */}

                <div className="mini-stats">

                    <div className="mini-stat">

                        <div className="mini-icon">
                            ×
                        </div>

                        <div className="mini-content">

                            <span className="mini-label">
                                Rejected
                            </span>

                            <span className="mini-value">
                                {dashboard.rejected}
                            </span>

                        </div>

                    </div>


                    <div className="mini-stat">

                        <div className="mini-icon">
                            ♡
                        </div>

                        <div className="mini-content">

                            <span className="mini-label">
                                Saved Opportunities
                            </span>

                            <span className="mini-value">
                                {dashboard.savedOpportunities}
                            </span>

                        </div>

                    </div>


                    <div className="mini-stat">

                        <div className="mini-icon">
                            ◷
                        </div>

                        <div className="mini-content">

                            <span className="mini-label">
                                Upcoming Interviews
                            </span>

                            <span className="mini-value">
                                {dashboard.upcomingInterviews}
                            </span>

                        </div>

                    </div>


                    <div className="mini-stat">

                        <div className="mini-icon">
                            ♢
                        </div>

                        <div className="mini-content">

                            <span className="mini-label">
                                Notifications
                            </span>

                            <span className="mini-value">
                                {dashboard.unreadNotifications}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =========================
                    LOWER DASHBOARD
                ========================= */}

                <div className="dashboard-columns">


                    {/* CAREER JOURNEY */}

                    <div className="dashboard-card">

                        <div className="card-heading">

                            <div>

                                <h2>
                                    Career Journey
                                </h2>

                                <p>
                                    Build your profile step by step
                                </p>

                            </div>

                        </div>


                        <div className="profile-strength">

                            <div className="progress-circle">

                                <span className="progress-number">
                                    70%
                                </span>

                            </div>


                            <div className="progress-info">

                                <h3>
                                    Keep building your profile
                                </h3>

                                <p>
                                    A complete profile helps
                                    recruiters understand your
                                    skills and experience.
                                </p>

                            </div>

                        </div>


                        <div className="profile-progress">

                            <div className="progress-bar">

                                <div className="progress-fill"></div>

                            </div>

                            <div className="progress-text">

                                <span>
                                    Profile Strength
                                </span>

                                <span>
                                    70%
                                </span>

                            </div>

                        </div>


                        <div className="journey-list">

                            <div
                                className="journey-item completed"
                                onClick={() =>
                                    navigate(
                                        "/student/profile"
                                    )
                                }
                            >

                                <div className="journey-icon">
                                    ✓
                                </div>

                                <div className="journey-text">

                                    <strong>
                                        Complete your profile
                                    </strong>

                                    <span>
                                        Add your education,
                                        location and career goals
                                    </span>

                                </div>

                            </div>


                            <div
                                className="journey-item"
                                onClick={() =>
                                    navigate(
                                        "/student/skills"
                                    )
                                }
                            >

                                <div className="journey-icon">
                                    ◆
                                </div>

                                <div className="journey-text">

                                    <strong>
                                        Add your skills
                                    </strong>

                                    <span>
                                        Show recruiters what
                                        you can do
                                    </span>

                                </div>

                            </div>


                            <div
                                className="journey-item"
                                onClick={() =>
                                    navigate(
                                        "/student/resume"
                                    )
                                }
                            >

                                <div className="journey-icon">
                                    ↑
                                </div>

                                <div className="journey-text">

                                    <strong>
                                        Upload your resume
                                    </strong>

                                    <span>
                                        Keep your latest resume
                                        ready for applications
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* QUICK ACTIONS */}

                    <div className="dashboard-card">

                        <div className="card-heading">

                            <div>

                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Jump to what you need
                                </p>

                            </div>

                        </div>


                        <div className="quick-actions">


                            <div
                                className="quick-action"
                                onClick={() =>
                                    navigate(
                                        "/student/opportunities"
                                    )
                                }
                            >

                                <div className="quick-action-icon">
                                    🔎
                                </div>

                                <div className="quick-action-text">

                                    <strong>
                                        Find Opportunities
                                    </strong>

                                    <span>
                                        Explore jobs & internships
                                    </span>

                                </div>

                            </div>


                            <div
                                className="quick-action"
                                onClick={() =>
                                    navigate(
                                        "/student/applications"
                                    )
                                }
                            >

                                <div className="quick-action-icon">
                                    📄
                                </div>

                                <div className="quick-action-text">

                                    <strong>
                                        Track Applications
                                    </strong>

                                    <span>
                                        Check your application status
                                    </span>

                                </div>

                            </div>


                            <div
                                className="quick-action"
                                onClick={() =>
                                    navigate(
                                        "/student/profile"
                                    )
                                }
                            >

                                <div className="quick-action-icon">
                                    👤
                                </div>

                                <div className="quick-action-text">

                                    <strong>
                                        Complete Profile
                                    </strong>

                                    <span>
                                        Improve your visibility
                                    </span>

                                </div>

                            </div>


                            <div
                                className="quick-action"
                                onClick={() =>
                                    navigate(
                                        "/student/skills"
                                    )
                                }
                            >

                                <div className="quick-action-icon">
                                    🛠
                                </div>

                                <div className="quick-action-text">

                                    <strong>
                                        Manage Skills
                                    </strong>

                                    <span>
                                        Add your technical skills
                                    </span>

                                </div>

                            </div>


                            <div
                                className="quick-action"
                                onClick={() =>
                                    navigate(
                                        "/student/resume"
                                    )
                                }
                            >

                                <div className="quick-action-icon">
                                    📑
                                </div>

                                <div className="quick-action-text">

                                    <strong>
                                        Manage Resume
                                    </strong>

                                    <span>
                                        Keep your resume updated
                                    </span>

                                </div>

                            </div>


                            <div
                                className="quick-action"
                                onClick={() =>
                                    navigate(
                                        "/student/notifications"
                                    )
                                }
                            >

                                <div className="quick-action-icon">
                                    🔔
                                </div>

                                <div className="quick-action-text">

                                    <strong>
                                        Notifications
                                    </strong>

                                    <span>
                                        View recent updates
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================
                    BOTTOM CTA
                ========================= */}

                <div className="dashboard-cta">

                    <div>

                        <h2>
                            Ready for your next opportunity? 🚀
                        </h2>

                        <p>
                            Discover internships and jobs
                            matched to your skills and goals.
                        </p>

                    </div>

                    <button
                        className="cta-button"
                        onClick={() =>
                            navigate(
                                "/student/opportunities"
                            )
                        }
                    >
                        Explore Opportunities →
                    </button>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default StudentDashboard;