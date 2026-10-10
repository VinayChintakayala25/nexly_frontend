import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STUDENT",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const name = formData.name.trim();
        const email = formData.email.trim();
        const phone = formData.phone.trim();

        if (!name) {
            setError("Please enter your full name.");
            return;
        }

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("Please enter a valid email address.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name,
                email,
                password: formData.password,
                phone,
                role: formData.role,
            };

            await registerUser(payload);

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            console.error("Registration error:", err);

            const backendMessage =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Registration failed. Please try again.";

            setError(backendMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nexly-register-page">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <header className="nexly-register-navbar">

                <Link
                    to="/login"
                    className="nexly-register-logo"
                >
                    <img
                        src="/nexly-logo.png"
                        alt="Nexly"
                    />
                </Link>

                <div className="nexly-register-header-right">
                    <span>Already have an account?</span>

                    <Link
                        to="/login"
                        className="nexly-register-login-link"
                    >
                        Sign in
                    </Link>
                </div>

            </header>


            {/* =====================================================
                MAIN
            ====================================================== */}

            <main className="nexly-register-main">

                {/* =================================================
                    LEFT — REGISTRATION FORM
                ================================================== */}

                <section className="nexly-register-left">

                    <div className="nexly-register-content">

                        <div className="nexly-register-badge">
                            <span className="nexly-register-dot"></span>
                            Get started with Nexly
                        </div>


                        <h1>
                            Build your
                            <span>future with Nexly.</span>
                        </h1>


                        <p className="nexly-register-description">
                            Create your professional profile, discover
                            relevant opportunities, connect with recruiters,
                            and take the next step in your career journey.
                        </p>


                        {/* FEATURES */}

                        <div className="nexly-register-features">

                            <div className="nexly-register-feature">

                                <div className="nexly-register-feature-icon">
                                    👤
                                </div>

                                <div>
                                    <strong>
                                        Build your profile
                                    </strong>

                                    <span>
                                        Showcase your skills and experience.
                                    </span>
                                </div>

                            </div>


                            <div className="nexly-register-feature">

                                <div className="nexly-register-feature-icon">
                                    🎯
                                </div>

                                <div>
                                    <strong>
                                        Find opportunities
                                    </strong>

                                    <span>
                                        Discover jobs, internships and projects.
                                    </span>
                                </div>

                            </div>


                            <div className="nexly-register-feature">

                                <div className="nexly-register-feature-icon">
                                    🚀
                                </div>

                                <div>
                                    <strong>
                                        Grow your career
                                    </strong>

                                    <span>
                                        Connect with the right people.
                                    </span>
                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FORM
                        ================================================== */}

                        <form
                            className="nexly-register-form"
                            onSubmit={handleSubmit}
                        >

                            {/* NAME + PHONE */}

                            <div className="nexly-register-row">

                                <div className="nexly-register-group">

                                    <label>
                                        Full name
                                    </label>

                                    <div className="nexly-register-input-wrapper">

                                        <span className="nexly-input-icon">
                                            ●
                                        </span>

                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                            autoComplete="name"
                                        />

                                    </div>

                                </div>


                                <div className="nexly-register-group">

                                    <label>
                                        Phone
                                        <span> Optional</span>
                                    </label>

                                    <div className="nexly-register-input-wrapper">

                                        <span className="nexly-input-icon">
                                            #
                                        </span>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone number"
                                            autoComplete="tel"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="nexly-register-group">

                                <label>
                                    Email address
                                </label>

                                <div className="nexly-register-input-wrapper">

                                    <span className="nexly-input-icon">
                                        @
                                    </span>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                    />

                                </div>

                            </div>


                            {/* ROLE */}

                            <div className="nexly-register-group">

                                <label>
                                    I am joining as
                                </label>

                                <div className="nexly-register-input-wrapper">

                                    <span className="nexly-input-icon">
                                        ◆
                                    </span>

                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="STUDENT">
                                            Student
                                        </option>

                                        <option value="RECRUITER">
                                            Recruiter
                                        </option>
                                    </select>

                                </div>

                            </div>


                            {/* PASSWORD ROW */}

                            <div className="nexly-register-row">

                                <div className="nexly-register-group">

                                    <label>
                                        Password
                                    </label>

                                    <div className="nexly-register-input-wrapper">

                                        <span className="nexly-input-icon">
                                            •••
                                        </span>

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Minimum 6 characters"
                                            autoComplete="new-password"
                                        />

                                        <button
                                            type="button"
                                            className="nexly-password-toggle"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                        >
                                            {showPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                    </div>

                                </div>


                                <div className="nexly-register-group">

                                    <label>
                                        Confirm password
                                    </label>

                                    <div className="nexly-register-input-wrapper">

                                        <span className="nexly-input-icon">
                                            •••
                                        </span>

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={
                                                formData.confirmPassword
                                            }
                                            onChange={handleChange}
                                            placeholder="Repeat password"
                                            autoComplete="new-password"
                                        />

                                        <button
                                            type="button"
                                            className="nexly-password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                    </div>

                                </div>

                            </div>


                            {/* ERROR */}

                            {error && (
                                <div className="nexly-register-error">

                                    <span>!</span>

                                    {error}

                                </div>
                            )}


                            {/* SUCCESS */}

                            {success && (
                                <div className="nexly-register-success">

                                    <span>✓</span>

                                    {success}

                                </div>
                            )}


                            {/* CREATE ACCOUNT */}

                            <button
                                type="submit"
                                className="nexly-create-account-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="nexly-register-spinner"></span>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <span>→</span>
                                    </>
                                )}

                            </button>


                            {/* LOGIN */}

                            <div className="nexly-register-divider">

                                <span></span>

                                <p>
                                    Already have an account?
                                </p>

                                <span></span>

                            </div>


                            <Link
                                to="/login"
                                className="nexly-register-signin-button"
                            >
                                Sign in to Nexly
                            </Link>


                            <p className="nexly-security-note">
                                Your account will be securely stored and
                                protected by Nexly's authentication system.
                            </p>

                        </form>

                    </div>

                </section>


                {/* =================================================
                    RIGHT — ANIMATION
                ================================================== */}

                <section className="nexly-register-right">

                    <div className="nexly-register-animation-wrapper">

                        <img
                            src="/register-animation.gif"
                            alt="Build your professional future with Nexly"
                            className="nexly-register-animation"
                        />

                    </div>

                </section>

            </main>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer className="nexly-register-footer">

                <span>
                    © 2026 Nexly
                </span>

                <span>•</span>

                <span>
                    Connecting Talent to What's Next
                </span>

            </footer>

        </div>
    );
}

export default Register;