import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
    const location = useLocation();

    const token = localStorage.getItem("nexly_token");
    const storedUser = localStorage.getItem("nexly_user");

    // User is not logged in
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    let user = null;

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Invalid stored user:", error);
        localStorage.removeItem("nexly_user");
    }

    // If user information is missing, send them back to login
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Normalize role
    const userRole = String(user.role || "").toUpperCase();

    // Check whether this role is allowed
    if (
        allowedRoles &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(userRole)
    ) {
        if (userRole === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }

        if (userRole === "RECRUITER") {
            return <Navigate to="/recruiter" replace />;
        }

        if (userRole === "STUDENT") {
            return <Navigate to="/student" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;