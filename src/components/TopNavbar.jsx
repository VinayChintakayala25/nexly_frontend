import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TopNavbar({
    notificationCount = 0,
    onMenuClick
}) {
    const { user } = useAuth();

    const firstName =
        user?.name?.split(" ")[0] ||
        user?.email?.split("@")[0] ||
        "Student";

    const initials =
        firstName
            .charAt(0)
            .toUpperCase();

    return (
        <header className="nexly-topbar">

            {/* MOBILE MENU BUTTON */}
            <button
                className="mobile-menu-button"
                onClick={onMenuClick}
                aria-label="Open navigation menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* SEARCH */}
            <div className="topbar-search">

                <span className="search-icon">
                    ⌕
                </span>

                <input
                    type="text"
                    placeholder="Search opportunities, skills..."
                />

                <span className="search-shortcut">
                    /
                </span>

            </div>

            {/* RIGHT SIDE */}
            <div className="topbar-right">

                {/* NOTIFICATIONS */}
                <Link
                    to="/student/notifications"
                    className="topbar-notification"
                    aria-label="Notifications"
                >
                    <span className="notification-icon">
                        ♢
                    </span>

                    {notificationCount > 0 && (
                        <span className="notification-badge">
                            {notificationCount > 99
                                ? "99+"
                                : notificationCount}
                        </span>
                    )}
                </Link>

                {/* USER */}
                <Link
                    to="/student/profile"
                    className="topbar-user"
                >

                    <div className="topbar-avatar">
                        {initials}
                    </div>

                    <div className="topbar-user-info">

                        <strong>
                            {firstName}
                        </strong>

                        <span>
                            Student
                        </span>

                    </div>

                    <span className="topbar-chevron">
                        ▾
                    </span>

                </Link>

            </div>

        </header>
    );
}

export default TopNavbar;