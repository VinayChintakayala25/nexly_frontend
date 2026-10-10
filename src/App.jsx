import { Navigate, Route, Routes } from "react-router-dom";

// =====================================================
// AUTH
// =====================================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// =====================================================
// PROTECTED ROUTES
// =====================================================

import ProtectedRoute from "./components/ProtectedRoute";

// =====================================================
// STUDENT
// =====================================================

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSkills from "./pages/student/StudentSkills";
import StudentResume from "./pages/student/StudentResume";

import BrowseOpportunities from "./pages/student/BrowseOpportunities";
import OpportunityDetails from "./pages/student/OpportunityDetails";
import StudentApply from "./pages/student/StudentApply";

import StudentApplications from "./pages/student/StudentApplications";
import StudentSaved from "./pages/student/StudentSaved";

import StudentNotifications from "./pages/student/StudentNotifications";
import StudentInterviews from "./pages/student/StudentInterviews";

import StudentMatching from "./pages/student/StudentMatching";
import StudentSettings from "./pages/student/StudentSettings";

// =====================================================
// RECRUITER
// =====================================================

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterCompany from "./pages/recruiter/RecruiterCompany";
import RecruiterCreateOpportunity from "./pages/recruiter/RecruiterCreateOpportunity";
import RecruiterOpportunities from "./pages/recruiter/RecruiterOpportunities";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminOpportunities from "./pages/admin/AdminOpportunities";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminReports from "./pages/admin/AdminReports";

// =====================================================
// APP
// =====================================================

function App() {
    return (
        <Routes>

            {/* =================================================
                PUBLIC AUTH ROUTES
            ================================================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =================================================
                STUDENT PROTECTED ROUTES
            ================================================= */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["STUDENT"]}
                    />
                }
            >

                {/* STUDENT DASHBOARD */}

                <Route
                    path="/student"
                    element={<StudentDashboard />}
                />


                {/* STUDENT PROFILE */}

                <Route
                    path="/student/profile"
                    element={<StudentProfile />}
                />


                {/* STUDENT SKILLS */}

                <Route
                    path="/student/skills"
                    element={<StudentSkills />}
                />


                {/* STUDENT RESUME */}

                <Route
                    path="/student/resume"
                    element={<StudentResume />}
                />


                {/* STUDENT OPPORTUNITIES */}

                <Route
                    path="/student/opportunities"
                    element={<BrowseOpportunities />}
                />

                <Route
                    path="/student/opportunities/:id"
                    element={<OpportunityDetails />}
                />


                {/* STUDENT APPLY */}

                <Route
                    path="/student/opportunities/:id/apply"
                    element={<StudentApply />}
                />


                {/* STUDENT MATCHING */}

                <Route
                    path="/student/matching"
                    element={<StudentMatching />}
                />


                {/* STUDENT APPLICATIONS */}

                <Route
                    path="/student/applications"
                    element={<StudentApplications />}
                />


                {/* STUDENT SAVED OPPORTUNITIES */}

                <Route
                    path="/student/saved"
                    element={<StudentSaved />}
                />


                {/* STUDENT INTERVIEWS */}

                <Route
                    path="/student/interviews"
                    element={<StudentInterviews />}
                />


                {/* STUDENT NOTIFICATIONS */}

                <Route
                    path="/student/notifications"
                    element={<StudentNotifications />}
                />


                {/* STUDENT SETTINGS */}

                <Route
                    path="/student/settings"
                    element={<StudentSettings />}
                />

            </Route>


            {/* =================================================
                RECRUITER PROTECTED ROUTES
            ================================================= */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["RECRUITER"]}
                    />
                }
            >

                {/* RECRUITER DASHBOARD */}

                <Route
                    path="/recruiter"
                    element={<RecruiterDashboard />}
                />


                {/* RECRUITER COMPANY PROFILE */}

                <Route
                    path="/recruiter/company"
                    element={<RecruiterCompany />}
                />


                {/* RECRUITER CREATE OPPORTUNITY */}

                <Route
                    path="/recruiter/opportunities/create"
                    element={<RecruiterCreateOpportunity />}
                />


                {/* RECRUITER MANAGE OPPORTUNITIES */}

                <Route
                    path="/recruiter/opportunities"
                    element={<RecruiterOpportunities />}
                />


                {/* RECRUITER APPLICATIONS */}

                <Route
                    path="/recruiter/applications"
                    element={<RecruiterApplications />}
                />


                {/* RECRUITER INTERVIEWS */}

                <Route
                    path="/recruiter/interviews"
                    element={<RecruiterInterviews />}
                />

            </Route>


            {/* =================================================
                ADMIN PROTECTED ROUTES
            ================================================= */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["ADMIN"]}
                    />
                }
            >

                {/* ADMIN DASHBOARD */}

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />


                {/* ADMIN USER MANAGEMENT */}

                <Route
                    path="/admin/users"
                    element={<AdminUsers />}
                />


                {/* ADMIN COMPANY MANAGEMENT */}

                <Route
                    path="/admin/companies"
                    element={<AdminCompanies />}
                />


                {/* ADMIN OPPORTUNITY MANAGEMENT */}

                <Route
                    path="/admin/opportunities"
                    element={<AdminOpportunities />}
                />


                {/* ADMIN APPLICATION MANAGEMENT */}

                <Route
                    path="/admin/applications"
                    element={<AdminApplications />}
                />


                {/* ADMIN AUDIT LOGS */}

                <Route
                    path="/admin/audit-logs"
                    element={<AdminAuditLogs />}
                />


                {/* ADMIN REPORTS */}

                <Route
                    path="/admin/reports"
                    element={<AdminReports />}
                />

            </Route>


            {/* =================================================
                404 PAGE
            ================================================= */}

            <Route
                path="*"
                element={
                    <div
                        style={{
                            minHeight: "100vh",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "40px",
                            textAlign: "center",
                            background: "#f6f8fc",
                        }}
                    >

                        <h1
                            style={{
                                marginBottom: "10px",
                                color: "#172033",
                            }}
                        >
                            Page Not Found
                        </h1>

                        <p
                            style={{
                                marginBottom: "20px",
                                color: "#6b7280",
                            }}
                        >
                            The page you are trying to open
                            does not exist.
                        </p>

                        <button
                            onClick={() => {

                                const storedUser =
                                    localStorage.getItem("nexly_user");

                                if (!storedUser) {
                                    window.location.href = "/login";
                                    return;
                                }

                                try {

                                    const user =
                                        JSON.parse(storedUser);

                                    const role =
                                        String(
                                            user?.role || ""
                                        ).toUpperCase();

                                    if (role === "ADMIN") {
                                        window.location.href = "/admin";
                                    }
                                    else if (role === "RECRUITER") {
                                        window.location.href = "/recruiter";
                                    }
                                    else if (role === "STUDENT") {
                                        window.location.href = "/student";
                                    }
                                    else {
                                        window.location.href = "/login";
                                    }

                                } catch (error) {

                                    console.error(
                                        "Invalid user data:",
                                        error
                                    );

                                    window.location.href = "/login";
                                }

                            }}
                            style={{
                                padding: "11px 20px",
                                border: "none",
                                borderRadius: "9px",
                                background: "#4f46e5",
                                color: "#ffffff",
                                cursor: "pointer",
                                fontWeight: "600",
                            }}
                        >
                            Go to Dashboard
                        </button>

                    </div>
                }
            />

        </Routes>
    );
}

export default App;