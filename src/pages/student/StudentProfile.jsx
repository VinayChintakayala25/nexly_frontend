import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loading from "../../components/Loading";
import "./StudentProfile.css";

function StudentProfile() {
    const [profile, setProfile] = useState({
        fullName: "",
        phone: "",
        college: "",
        degree: "",
        department: "",
        year: "",
        graduationYear: "",
        location: "",
        bio: "",
        careerObjective: "",
        githubUrl: "",
        linkedinUrl: "",
        portfolioUrl: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/student/profile");

            if (response.data) {
                setProfile({
                    fullName: response.data.fullName || "",
                    phone: response.data.phone || "",
                    college: response.data.college || "",
                    degree: response.data.degree || "",
                    department: response.data.department || "",

                    // Backend expects Integer
                    year:
                        response.data.year !== null &&
                        response.data.year !== undefined
                            ? String(response.data.year)
                            : "",

                    graduationYear:
                        response.data.graduationYear !== null &&
                        response.data.graduationYear !== undefined
                            ? String(response.data.graduationYear)
                            : "",

                    location: response.data.location || "",
                    bio: response.data.bio || "",
                    careerObjective:
                        response.data.careerObjective || "",
                    githubUrl: response.data.githubUrl || "",
                    linkedinUrl:
                        response.data.linkedinUrl || "",
                    portfolioUrl:
                        response.data.portfolioUrl || ""
                });
            }
        } catch (err) {
            console.error("Profile loading error:", err);

            if (err.response?.status !== 404) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load profile."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));

        setMessage("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            /*
             * The backend expects:
             * year = Integer
             * graduationYear = Integer
             *
             * The UI keeps these values as strings
             * because they come from HTML inputs/selects.
             */

            const profileData = {
                ...profile,

                year:
                    profile.year !== ""
                        ? Number(profile.year)
                        : null,

                graduationYear:
                    profile.graduationYear !== ""
                        ? Number(profile.graduationYear)
                        : null
            };

            await api.post(
                "/student/profile",
                profileData
            );

            setMessage(
                "Profile updated successfully!"
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } catch (err) {
            console.error(
                "Profile save error:",
                err
            );

            console.error(
                "Server response:",
                err.response?.data
            );

            setError(
                err.response?.data?.message ||
                "Unable to save profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loading text="Loading your profile..." />
            </DashboardLayout>
        );
    }

    const initials =
        profile.fullName
            ?.split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() || "N";

    return (
        <DashboardLayout>

            <div className="profile-page">

                {/* HEADER */}
                <div className="profile-page-header">

                    <div>
                        <span className="profile-eyebrow">
                            MY PROFILE
                        </span>

                        <h1>
                            Build your professional identity
                        </h1>

                        <p>
                            Keep your profile updated so recruiters
                            can understand your skills, education
                            and career goals.
                        </p>
                    </div>

                    <Link
                        to="/student"
                        className="profile-back-btn"
                    >
                        ← Dashboard
                    </Link>

                </div>

                {/* ALERTS */}
                {message && (
                    <div className="profile-alert success">
                        <span>✓</span>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="profile-alert error">
                        <span>!</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* PROFILE HERO */}
                    <div className="profile-card profile-hero-card">

                        <div className="profile-avatar">
                            {initials}
                        </div>

                        <div className="profile-hero-info">
                            <h2>
                                {profile.fullName ||
                                    "Your Name"}
                            </h2>

                            <p>
                                {profile.degree ||
                                    "Computer Science Student"}
                            </p>

                            <span>
                                {profile.college ||
                                    "Add your college"}
                            </span>
                        </div>

                        <div className="profile-completion">

                            <div className="completion-number">
                                75%
                            </div>

                            <div>
                                <strong>
                                    Profile strength
                                </strong>

                                <p>
                                    Complete your profile to improve
                                    your visibility.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* PERSONAL INFORMATION */}
                    <div className="profile-card">

                        <div className="profile-section-title">

                            <div className="section-icon">
                                👤
                            </div>

                            <div>
                                <h2>
                                    Personal Information
                                </h2>

                                <p>
                                    Basic information about you
                                </p>
                            </div>

                        </div>

                        <div className="profile-grid">

                            <div className="profile-field">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />

                            </div>

                            <div className="profile-field">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />

                            </div>

                            <div className="profile-field">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={profile.location}
                                    onChange={handleChange}
                                    placeholder="City, State"
                                />

                            </div>

                            <div className="profile-field">

                                <label>
                                    College / University
                                </label>

                                <input
                                    type="text"
                                    name="college"
                                    value={profile.college}
                                    onChange={handleChange}
                                    placeholder="Enter college name"
                                />

                            </div>

                        </div>

                    </div>

                    {/* EDUCATION */}
                    <div className="profile-card">

                        <div className="profile-section-title">

                            <div className="section-icon">
                                🎓
                            </div>

                            <div>
                                <h2>
                                    Education
                                </h2>

                                <p>
                                    Tell recruiters about your academic
                                    background
                                </p>
                            </div>

                        </div>

                        <div className="profile-grid">

                            <div className="profile-field">

                                <label>
                                    Degree
                                </label>

                                <input
                                    type="text"
                                    name="degree"
                                    value={profile.degree}
                                    onChange={handleChange}
                                    placeholder="B.Tech"
                                />

                            </div>

                            <div className="profile-field">

                                <label>
                                    Department
                                </label>

                                <input
                                    type="text"
                                    name="department"
                                    value={profile.department}
                                    onChange={handleChange}
                                    placeholder="Computer Science"
                                />

                            </div>

                            <div className="profile-field">

                                <label>
                                    Current Year
                                </label>

                                <select
                                    name="year"
                                    value={profile.year}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select year
                                    </option>

                                    <option value="1">
                                        1st Year
                                    </option>

                                    <option value="2">
                                        2nd Year
                                    </option>

                                    <option value="3">
                                        3rd Year
                                    </option>

                                    <option value="4">
                                        4th Year
                                    </option>

                                </select>

                            </div>

                            <div className="profile-field">

                                <label>
                                    Graduation Year
                                </label>

                                <input
                                    type="number"
                                    name="graduationYear"
                                    value={
                                        profile.graduationYear
                                    }
                                    onChange={handleChange}
                                    placeholder="2029"
                                />

                            </div>

                        </div>

                    </div>

                    {/* ABOUT */}
                    <div className="profile-card">

                        <div className="profile-section-title">

                            <div className="section-icon">
                                ✨
                            </div>

                            <div>
                                <h2>
                                    About & Career Goals
                                </h2>

                                <p>
                                    Help recruiters understand your
                                    professional interests
                                </p>
                            </div>

                        </div>

                        <div className="profile-field">

                            <label>
                                Professional Bio
                            </label>

                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Write a short introduction about yourself..."
                            />

                        </div>

                        <div className="profile-field">

                            <label>
                                Career Objective
                            </label>

                            <textarea
                                name="careerObjective"
                                value={
                                    profile.careerObjective
                                }
                                onChange={handleChange}
                                rows="4"
                                placeholder="What kind of career or opportunities are you looking for?"
                            />

                        </div>

                    </div>

                    {/* SOCIAL LINKS */}
                    <div className="profile-card">

                        <div className="profile-section-title">

                            <div className="section-icon">
                                🔗
                            </div>

                            <div>
                                <h2>
                                    Professional Links
                                </h2>

                                <p>
                                    Connect your professional presence
                                </p>
                            </div>

                        </div>

                        <div className="profile-grid">

                            <div className="profile-field">

                                <label>
                                    GitHub
                                </label>

                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={profile.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                />

                            </div>

                            <div className="profile-field">

                                <label>
                                    LinkedIn
                                </label>

                                <input
                                    type="url"
                                    name="linkedinUrl"
                                    value={profile.linkedinUrl}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                />

                            </div>

                            <div className="profile-field full-width">

                                <label>
                                    Portfolio
                                </label>

                                <input
                                    type="url"
                                    name="portfolioUrl"
                                    value={profile.portfolioUrl}
                                    onChange={handleChange}
                                    placeholder="https://yourportfolio.com"
                                />

                            </div>

                        </div>

                    </div>

                    {/* SAVE BAR */}
                    <div className="profile-save-bar">

                        <div>

                            <strong>
                                Keep your profile updated
                            </strong>

                            <span>
                                Your information helps Nexly find
                                relevant opportunities.
                            </span>

                        </div>

                        <button
                            type="submit"
                            className="profile-save-btn"
                            disabled={saving}
                        >

                            {saving ? (
                                <>
                                    <span className="button-spinner" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Save Profile →
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </DashboardLayout>
    );
}

export default StudentProfile;