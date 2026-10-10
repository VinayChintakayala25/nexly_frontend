import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            const loggedInUser = await login(
                formData.email.trim(),
                formData.password
            );

            if (loggedInUser) {
                localStorage.setItem(
                    "nexly_user",
                    JSON.stringify(loggedInUser)
                );
            }

            const role = String(
                loggedInUser?.role || ""
            ).toUpperCase();

            if (role === "ADMIN") {
                navigate("/admin");
                return;
            }

            if (role === "RECRUITER") {
                try {
                    await api.get("/recruiter/company");
                    navigate("/recruiter");
                } catch (companyError) {
                    navigate("/recruiter/company");
                }

                return;
            }

            if (role === "STUDENT") {
                navigate("/student");
                return;
            }

            setError(
                "Your account role could not be identified. Please contact support."
            );

        } catch (err) {
            console.error("Login error:", err);

            const message =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.message ||
                "Login failed. Please check your credentials.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nexly-login-page">

            {/* ================= HEADER ================= */}

            <header className="nexly-login-navbar">

                <Link
                    to="/"
                    className="nexly-login-logo"
                >
                    <img
                        src="/nexly-logo.png"
                        alt="Nexly"
                    />
                </Link>

                <div className="nexly-login-navbar-right">

                    <span>
                        New to Nexly?
                    </span>

                    <Link
                        to="/register"
                        className="nexly-join-link"
                    >
                        Join now
                    </Link>

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className="nexly-login-main">

                {/* ================= LEFT CONTENT ================= */}

                <section className="nexly-login-left">

                    <div className="nexly-login-content">

                        <div className="nexly-welcome-label">
                            <span className="nexly-welcome-dot"></span>
                            Welcome to Nexly
                        </div>


                        <h1>
                            Make your professional
                            <span>
                                journey move forward.
                            </span>
                        </h1>


                        <p className="nexly-login-description">
                            Nexly connects students, recruiters, and
                            opportunities in one intelligent career
                            platform. Discover internships, jobs,
                            projects, and career opportunities based
                            on your skills and goals.
                        </p>


                        {/* ================= FEATURES ================= */}

                        <div className="nexly-feature-list">

                            <div className="nexly-feature-item">

                                <div className="nexly-feature-icon">
                                    🎯
                                </div>

                                <div>
                                    <strong>
                                        Smart Matching
                                    </strong>

                                    <span>
                                        Opportunities that fit your skills.
                                    </span>
                                </div>

                            </div>


                            <div className="nexly-feature-item">

                                <div className="nexly-feature-icon">
                                    💼
                                </div>

                                <div>
                                    <strong>
                                        Career Opportunities
                                    </strong>

                                    <span>
                                        Internships, jobs and projects.
                                    </span>
                                </div>

                            </div>


                            <div className="nexly-feature-item">

                                <div className="nexly-feature-icon">
                                    🚀
                                </div>

                                <div>
                                    <strong>
                                        Career Growth
                                    </strong>

                                    <span>
                                        Connect and move forward.
                                    </span>
                                </div>

                            </div>

                        </div>


                        {/* ================= FORM ================= */}

                        <form
                            className="nexly-login-form"
                            onSubmit={handleSubmit}
                        >

                            {error && (
                                <div className="nexly-login-error">

                                    <span>!</span>

                                    {error}

                                </div>
                            )}


                            {/* EMAIL */}

                            <div className="nexly-form-group">

                                <label htmlFor="email">
                                    Email or phone
                                </label>

                                <input
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    autoComplete="username"
                                    disabled={loading}
                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="nexly-form-group">

                                <div className="nexly-password-label">

                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="nexly-show-button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                />

                            </div>


                            <Link
                                to="/forgot-password"
                                className="nexly-forgot-link"
                            >
                                Forgot password?
                            </Link>


                            <button
                                type="submit"
                                className="nexly-signin-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="nexly-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <span className="nexly-button-arrow">
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </form>


                        {/* MOBILE JOIN */}

                        <div className="nexly-mobile-register">

                            <span>
                                New to Nexly?
                            </span>

                            <Link to="/register">
                                Join now
                            </Link>

                        </div>

                    </div>

                </section>


                {/* ================= RIGHT IMAGE ================= */}

                <section className="nexly-login-right">

                    <div className="nexly-illustration-wrapper">

                        <img
                            src="/nexly-remote-work.gif"
                            alt="Nexly career platform"
                            className="nexly-login-animation"
                        />

                    </div>

                </section>

            </main>


            {/* ================= FOOTER ================= */}

            <footer className="nexly-login-footer">

                <span>
                    © 2026 Nexly
                </span>

                <span className="nexly-footer-separator">
                    •
                </span>

                <span>
                    Connecting Talent to What's Next
                </span>

            </footer>

        </div>
    );
}

export default Login;