import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
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

            const response = await api.get("/admin/dashboard");

            setDashboard(response.data);
        } catch (err) {
            console.error("Admin dashboard error:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load admin dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const goTo = (path) => {
        navigate(path);
    };

    if (loading) {
        return (
            <div className="admin-dashboard-page">
                <div className="admin-loading">
                    <div className="admin-loading-spinner"></div>

                    <h2>
                        Loading Admin Dashboard
                    </h2>

                    <p>
                        Please wait while we load the latest platform data.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard-page">
                <div className="admin-error-card">

                    <div className="admin-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="admin-retry-button"
                        onClick={loadDashboard}
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="admin-dashboard-header">

                <div className="admin-header-content">

                    <span className="admin-eyebrow">
                        NEXLY ADMINISTRATION
                    </span>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Monitor users, opportunities, applications
                        and overall platform activity.
                    </p>

                </div>

                <button
                    className="admin-refresh-button"
                    onClick={loadDashboard}
                >
                    ↻ Refresh
                </button>

            </header>


            {/* =================================================
                OVERVIEW
            ================================================= */}

            <section className="admin-section">

                <div className="admin-section-heading">

                    <div>
                        <span>
                            PLATFORM OVERVIEW
                        </span>

                        <h2>
                            Nexly at a glance
                        </h2>
                    </div>

                </div>


                <div className="admin-stat-grid">

                    {/* USERS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon users-icon">
                                👥
                            </div>

                            <span className="admin-stat-label">
                                Total Users
                            </span>

                        </div>

                        <h3>
                            {dashboard?.totalUsers ?? 0}
                        </h3>

                        <p>
                            Registered accounts
                        </p>

                    </div>


                    {/* STUDENTS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon students-icon">
                                🎓
                            </div>

                            <span className="admin-stat-label">
                                Students
                            </span>

                        </div>

                        <h3>
                            {dashboard?.totalStudents ?? 0}
                        </h3>

                        <p>
                            Student accounts
                        </p>

                    </div>


                    {/* RECRUITERS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon recruiters-icon">
                                💼
                            </div>

                            <span className="admin-stat-label">
                                Recruiters
                            </span>

                        </div>

                        <h3>
                            {dashboard?.totalRecruiters ?? 0}
                        </h3>

                        <p>
                            Recruiter accounts
                        </p>

                    </div>


                    {/* OPPORTUNITIES */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon opportunities-icon">
                                ◈
                            </div>

                            <span className="admin-stat-label">
                                Opportunities
                            </span>

                        </div>

                        <h3>
                            {dashboard?.totalOpportunities ?? 0}
                        </h3>

                        <p>
                            Total opportunities
                        </p>

                    </div>


                    {/* PUBLISHED */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon published-icon">
                                ✓
                            </div>

                            <span className="admin-stat-label">
                                Published
                            </span>

                        </div>

                        <h3>
                            {dashboard?.publishedOpportunities ?? 0}
                        </h3>

                        <p>
                            Live opportunities
                        </p>

                    </div>


                    {/* APPLICATIONS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon applications-icon">
                                ◉
                            </div>

                            <span className="admin-stat-label">
                                Applications
                            </span>

                        </div>

                        <h3>
                            {dashboard?.totalApplications ?? 0}
                        </h3>

                        <p>
                            Total applications
                        </p>

                    </div>


                    {/* SELECTED */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon selected-icon">
                                ★
                            </div>

                            <span className="admin-stat-label">
                                Selected
                            </span>

                        </div>

                        <h3>
                            {dashboard?.selectedApplications ?? 0}
                        </h3>

                        <p>
                            Successful applications
                        </p>

                    </div>


                    {/* NOTIFICATIONS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon notifications-icon">
                                🔔
                            </div>

                            <span className="admin-stat-label">
                                Notifications
                            </span>

                        </div>

                        <h3>
                            {dashboard?.unreadNotifications ?? 0}
                        </h3>

                        <p>
                            Unread notifications
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                MANAGEMENT
            ================================================= */}

            <section className="admin-section">

                <div className="admin-section-heading">

                    <div>
                        <span>
                            MANAGEMENT
                        </span>

                        <h2>
                            Manage Nexly
                        </h2>

                        <p>
                            Access the different areas of platform administration.
                        </p>
                    </div>

                </div>


                <div className="admin-management-grid">

                    {/* USERS */}

                    <button
                        className="admin-management-card"
                        onClick={() =>
                            goTo("/admin/users")
                        }
                    >

                        <div className="management-card-icon">
                            👥
                        </div>

                        <div className="management-card-content">

                            <h3>
                                User Management
                            </h3>

                            <p>
                                View, manage and monitor
                                student and recruiter accounts.
                            </p>

                        </div>

                        <span className="management-arrow">
                            →
                        </span>

                    </button>


                    {/* COMPANIES */}

                    <button
                        className="admin-management-card"
                        onClick={() =>
                            goTo("/admin/companies")
                        }
                    >

                        <div className="management-card-icon">
                            🏢
                        </div>

                        <div className="management-card-content">

                            <h3>
                                Company Management
                            </h3>

                            <p>
                                Review recruiter companies
                                and company information.
                            </p>

                        </div>

                        <span className="management-arrow">
                            →
                        </span>

                    </button>


                    {/* OPPORTUNITIES */}

                    <button
                        className="admin-management-card"
                        onClick={() =>
                            goTo("/admin/opportunities")
                        }
                    >

                        <div className="management-card-icon">
                            ◈
                        </div>

                        <div className="management-card-content">

                            <h3>
                                Opportunity Management
                            </h3>

                            <p>
                                Monitor jobs, internships
                                and published opportunities.
                            </p>

                        </div>

                        <span className="management-arrow">
                            →
                        </span>

                    </button>


                    {/* APPLICATIONS */}

                    <button
                        className="admin-management-card"
                        onClick={() =>
                            goTo("/admin/applications")
                        }
                    >

                        <div className="management-card-icon">
                            ◉
                        </div>

                        <div className="management-card-content">

                            <h3>
                                Application Management
                            </h3>

                            <p>
                                Monitor applications and
                                recruitment progress.
                            </p>

                        </div>

                        <span className="management-arrow">
                            →
                        </span>

                    </button>


                    {/* AUDIT LOGS */}

                    <button
                        className="admin-management-card"
                        onClick={() =>
                            goTo("/admin/audit-logs")
                        }
                    >

                        <div className="management-card-icon">
                            ◷
                        </div>

                        <div className="management-card-content">

                            <h3>
                                Audit Logs
                            </h3>

                            <p>
                                Track important administrative
                                and platform activities.
                            </p>

                        </div>

                        <span className="management-arrow">
                            →
                        </span>

                    </button>


                    {/* REPORTS */}

                    <button
                        className="admin-management-card"
                        onClick={() =>
                            goTo("/admin/reports")
                        }
                    >

                        <div className="management-card-icon">
                            ▣
                        </div>

                        <div className="management-card-content">

                            <h3>
                                Reports & Analytics
                            </h3>

                            <p>
                                Generate reports and review
                                platform statistics.
                            </p>

                        </div>

                        <span className="management-arrow">
                            →
                        </span>

                    </button>

                </div>

            </section>


            {/* =================================================
                PLATFORM STATUS
            ================================================= */}

            <section className="admin-platform-card">

                <div className="platform-status-icon">
                    ✓
                </div>

                <div className="platform-status-content">

                    <span>
                        PLATFORM STATUS
                    </span>

                    <h2>
                        Nexly is operational
                    </h2>

                    <p>
                        Your dashboard is connected to the live
                        Nexly backend and database.
                    </p>

                </div>

                <div className="platform-status-badge">
                    <span></span>
                    Connected
                </div>

            </section>

        </div>
    );
}

export default AdminDashboard;