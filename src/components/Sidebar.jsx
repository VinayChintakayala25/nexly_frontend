import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("nexly_user");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Unable to read Nexly user:", error);
        }
    }, []);

    const role = String(user?.role || "STUDENT").toUpperCase();

    const studentLinks = [
        {
            label: "Dashboard",
            path: "/student",
            icon: "⌂",
        },
        {
            label: "Opportunities",
            path: "/student/opportunities",
            icon: "◈",
        },
        {
            label: "Match & Skill Gap",
            path: "/student/matching",
            icon: "✦",
        },
        {
            label: "Applications",
            path: "/student/applications",
            icon: "▣",
        },
        {
            label: "Saved",
            path: "/student/saved",
            icon: "♡",
        },
        {
            label: "Profile",
            path: "/student/profile",
            icon: "◎",
        },
        {
            label: "Skills",
            path: "/student/skills",
            icon: "◆",
        },
        {
            label: "Resume",
            path: "/student/resume",
            icon: "▤",
        },
        {
            label: "Interviews",
            path: "/student/interviews",
            icon: "◷",
        },
        {
            label: "Notifications",
            path: "/student/notifications",
            icon: "♢",
        },
    ];

    const recruiterLinks = [
        {
            label: "Dashboard",
            path: "/recruiter",
            icon: "⌂",
        },
        {
            label: "Company",
            path: "/recruiter/company",
            icon: "▦",
        },
        {
            label: "Opportunities",
            path: "/recruiter/opportunities",
            icon: "◈",
        },
        {
            label: "Applications",
            path: "/recruiter/applications",
            icon: "▣",
        },
        {
            label: "Interviews",
            path: "/recruiter/interviews",
            icon: "◷",
        },
    ];

    const adminLinks = [
        {
            label: "Dashboard",
            path: "/admin",
            icon: "⌂",
        },
        {
            label: "Users",
            path: "/admin/users",
            icon: "◎",
        },
        {
            label: "Companies",
            path: "/admin/companies",
            icon: "▦",
        },
        {
            label: "Opportunities",
            path: "/admin/opportunities",
            icon: "◈",
        },
        {
            label: "Applications",
            path: "/admin/applications",
            icon: "▣",
        },
        {
            label: "Audit Logs",
            path: "/admin/audit-logs",
            icon: "▤",
        },
        {
            label: "Reports",
            path: "/admin/reports",
            icon: "◫",
        },
    ];

    let links = studentLinks;

    if (role === "RECRUITER") {
        links = recruiterLinks;
    }

    if (role === "ADMIN") {
        links = adminLinks;
    }

    const getDashboardPath = () => {
        if (role === "ADMIN") {
            return "/admin";
        }

        if (role === "RECRUITER") {
            return "/recruiter";
        }

        return "/student";
    };

    const handleLogout = () => {
        localStorage.removeItem("nexly_token");
        localStorage.removeItem("nexly_user");

        setMobileOpen(false);

        navigate("/login", {
            replace: true,
        });
    };

    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    return (
        <>
            {/* Mobile top bar */}
            <div className="nexly-mobile-topbar">
                <button
                    className="nexly-mobile-menu-button"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                >
                    ☰
                </button>

                <button
                    className="nexly-mobile-brand"
                    onClick={() => navigate(getDashboardPath())}
                >
                    <img
                        src="/nexly-logo.png"
                        alt="Nexly"
                    />
                </button>

                <button
                    className="nexly-mobile-profile"
                    onClick={() => {
                        if (role === "STUDENT") {
                            navigate("/student/profile");
                        }
                    }}
                >
                    {user?.name?.charAt(0)?.toUpperCase() || "N"}
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="nexly-sidebar-overlay"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`nexly-sidebar ${
                    mobileOpen ? "nexly-sidebar-open" : ""
                }`}
            >
                {/* Brand */}
                <div className="nexly-sidebar-brand">
                    <button
                        className="nexly-logo-button"
                        onClick={() => {
                            navigate(getDashboardPath());
                            closeMobileMenu();
                        }}
                    >
                        <img
                            src="/nexly-logo.png"
                            alt="Nexly"
                            className="nexly-sidebar-logo"
                        />
                    </button>

                    <button
                        className="nexly-sidebar-close"
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                    >
                        ×
                    </button>
                </div>

                {/* User mini profile */}
                <div className="nexly-sidebar-user">
                    <div className="nexly-user-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "N"}
                    </div>

                    <div className="nexly-user-info">
                        <strong>
                            {user?.name || "Nexly User"}
                        </strong>

                        <span>
                            {role === "ADMIN"
                                ? "Administrator"
                                : role === "RECRUITER"
                                ? "Recruiter"
                                : "Student"}
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="nexly-sidebar-nav">
                    <div className="nexly-nav-label">
                        MENU
                    </div>

                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === getDashboardPath()}
                            className={({ isActive }) =>
                                `nexly-sidebar-link ${
                                    isActive
                                        ? "nexly-sidebar-link-active"
                                        : ""
                                }`
                            }
                            onClick={closeMobileMenu}
                        >
                            <span className="nexly-sidebar-icon">
                                {link.icon}
                            </span>

                            <span className="nexly-sidebar-text">
                                {link.label}
                            </span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="nexly-sidebar-bottom">
                    <div className="nexly-sidebar-divider" />

                    <button
                        className="nexly-logout-button"
                        onClick={handleLogout}
                    >
                        <span className="nexly-sidebar-icon">
                            ↪
                        </span>

                        <span>
                            Logout
                        </span>
                    </button>

                    <div className="nexly-sidebar-footer">
                        <span>© 2026 Nexly</span>
                        <span>Connecting Talent to What's Next</span>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;