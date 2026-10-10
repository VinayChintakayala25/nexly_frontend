import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function DashboardLayout({
    children,
    notificationCount = 0,
}) {

    return (
        <div className="nexly-app">

            <Sidebar />

            <div className="nexly-content">

                <TopNavbar
                    notificationCount={notificationCount}
                />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;