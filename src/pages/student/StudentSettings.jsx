import { useEffect, useState } from "react";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "./StudentSettings.css";

function StudentSettings() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [notificationsEnabled, setNotificationsEnabled] =
        useState(true);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/student/profile");

            setProfile(response.data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load account settings."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (
        event
    ) => {
        const { name, value } =
            event.target;

        setPasswordData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const changePassword = async (
        event
    ) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {
            setError(
                "Please fill in all password fields."
            );
            return;
        }

        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {
            setError(
                "New passwords do not match."
            );
            return;
        }

        if (
            passwordData.newPassword.length < 6
        ) {
            setError(
                "New password must contain at least 6 characters."
            );
            return;
        }

        try {
            setSaving(true);

            /*
             * This endpoint will be connected to the
             * backend password-change module.
             */
            await api.put(
                "/student/settings/password",
                {
                    currentPassword:
                        passwordData.currentPassword,
                    newPassword:
                        passwordData.newPassword,
                }
            );

            setMessage(
                "Password changed successfully."
            );

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to change password."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="settings-loading">
                <Loading />
            </div>
        );
    }

    return (
        <div className="student-settings-page">

            {/* HEADER */}

            <div className="settings-header">

                <div>
                    <span className="settings-eyebrow">
                        ACCOUNT
                    </span>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your account and
                        notification preferences.
                    </p>
                </div>

            </div>


            {/* ERROR */}

            {error && (
                <div className="settings-message error">
                    <span>⚠</span>
                    <span>{error}</span>

                    <button
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>
                </div>
            )}


            {/* SUCCESS */}

            {message && (
                <div className="settings-message success">
                    <span>✓</span>
                    <span>{message}</span>

                    <button
                        onClick={() =>
                            setMessage("")
                        }
                    >
                        ×
                    </button>
                </div>
            )}


            {/* ACCOUNT */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        ◎
                    </div>

                    <div>
                        <h2>
                            Account Information
                        </h2>

                        <p>
                            Your Nexly account details.
                        </p>
                    </div>

                </div>


                <div className="settings-info-grid">

                    <div className="settings-info-item">

                        <span>
                            Full Name
                        </span>

                        <strong>
                            {profile?.fullName ||
                                profile?.name ||
                                "Not available"}
                        </strong>

                    </div>


                    <div className="settings-info-item">

                        <span>
                            Email
                        </span>

                        <strong>
                            {profile?.email ||
                                "Not available"}
                        </strong>

                    </div>


                    <div className="settings-info-item">

                        <span>
                            Phone
                        </span>

                        <strong>
                            {profile?.phone ||
                                "Not added"}
                        </strong>

                    </div>


                    <div className="settings-info-item">

                        <span>
                            Account Role
                        </span>

                        <strong>
                            STUDENT
                        </strong>

                    </div>

                </div>

            </section>


            {/* NOTIFICATIONS */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        🔔
                    </div>

                    <div>
                        <h2>
                            Notifications
                        </h2>

                        <p>
                            Control how Nexly keeps
                            you updated.
                        </p>
                    </div>

                </div>


                <div className="settings-toggle-row">

                    <div>

                        <strong>
                            Enable notifications
                        </strong>

                        <p>
                            Receive updates about
                            applications, interviews
                            and opportunities.
                        </p>

                    </div>


                    <button
                        type="button"
                        className={`settings-toggle ${
                            notificationsEnabled
                                ? "enabled"
                                : ""
                        }`}
                        onClick={() =>
                            setNotificationsEnabled(
                                (current) =>
                                    !current
                            )
                        }
                        aria-label="Toggle notifications"
                    >

                        <span />

                    </button>

                </div>

            </section>


            {/* PASSWORD */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        🔒
                    </div>

                    <div>
                        <h2>
                            Change Password
                        </h2>

                        <p>
                            Keep your Nexly account
                            secure.
                        </p>
                    </div>

                </div>


                <form
                    className="password-form"
                    onSubmit={
                        changePassword
                    }
                >

                    <div className="settings-field">

                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={
                                passwordData.currentPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            placeholder="Enter current password"
                        />

                    </div>


                    <div className="settings-field">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={
                                passwordData.newPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            placeholder="Enter new password"
                        />

                    </div>


                    <div className="settings-field">

                        <label>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                passwordData.confirmPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            placeholder="Confirm new password"
                        />

                    </div>


                    <button
                        type="submit"
                        className="change-password-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Changing..."
                            : "Change Password"}
                    </button>

                </form>

            </section>


            {/* ACCOUNT STATUS */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        ✓
                    </div>

                    <div>
                        <h2>
                            Account Status
                        </h2>

                        <p>
                            Current status of your
                            Nexly account.
                        </p>
                    </div>

                </div>


                <div className="account-status">

                    <span className="status-dot" />

                    <div>
                        <strong>
                            Active
                        </strong>

                        <p>
                            Your Nexly account is
                            currently active.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default StudentSettings;