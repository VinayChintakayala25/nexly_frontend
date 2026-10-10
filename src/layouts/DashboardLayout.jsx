import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import "../components/ResponsiveNavigation.css";

function DashboardLayout({
    children,
    notificationCount = 0
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="nexly-app">

            {/* MOBILE OVERLAY */}
            {mobileMenuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={closeMobileMenu}
                ></div>
            )}

            {/* SIDEBAR */}
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                closeMobileMenu={closeMobileMenu}
            />

            {/* MAIN CONTENT */}
            <div className="nexly-content">

                <TopNavbar
                    notificationCount={notificationCount}
                    onMenuClick={() =>
                        setMobileMenuOpen(true)
                    }
                />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;