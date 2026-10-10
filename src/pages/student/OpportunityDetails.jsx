import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "./OpportunityDetails.css";

function OpportunityDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [error, setError] = useState("");
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        loadOpportunity();
        checkSavedStatus();
    }, [id]);


    // =====================================================
    // LOAD OPPORTUNITY
    // =====================================================

    const loadOpportunity = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(`/opportunities/${id}`);

            setOpportunity(response.data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load opportunity."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // CHECK SAVED STATUS
    // =====================================================

    const checkSavedStatus = async () => {

        try {

            const response =
                await api.get(
                    `/student/saved/${id}/status`
                );

            setIsSaved(
                response.data?.saved === true
            );

        } catch (err) {

            console.error(
                "Unable to check saved status:",
                err
            );

            setIsSaved(false);
        }
    };


    // =====================================================
    // SAVE / UNSAVE
    // =====================================================

    const handleSaveToggle = async () => {

        try {

            setSaving(true);
            setSaveMessage("");

            if (isSaved) {

                await api.delete(
                    `/student/saved/${id}`
                );

                setIsSaved(false);

                setSaveMessage(
                    "Opportunity removed from saved list."
                );

            } else {

                await api.post(
                    `/student/saved/${id}`
                );

                setIsSaved(true);

                setSaveMessage(
                    "Opportunity saved successfully."
                );
            }

        } catch (err) {

            console.error(err);

            setSaveMessage(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to update saved opportunity."
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Not specified";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not specified";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =====================================================
    // POSTED TIME
    // =====================================================

    const getPostedTime = () => {

        if (!opportunity?.createdAt) {
            return "Recently posted";
        }

        const created =
            new Date(opportunity.createdAt);

        if (Number.isNaN(created.getTime())) {
            return "Recently posted";
        }

        const now = new Date();

        const difference =
            now.getTime() -
            created.getTime();

        const minutes =
            Math.floor(
                difference / 60000
            );

        if (minutes < 1) {
            return "Just now";
        }

        if (minutes < 60) {
            return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
        }

        const hours =
            Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours} hour${hours === 1 ? "" : "s"} ago`;
        }

        const days =
            Math.floor(hours / 24);

        if (days < 30) {
            return `${days} day${days === 1 ? "" : "s"} ago`;
        }

        const months =
            Math.floor(days / 30);

        return `${months} month${months === 1 ? "" : "s"} ago`;
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="opportunity-details-loading">
                <Loading />
            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !opportunity) {

        return (
            <div className="opportunity-details-error">

                <div className="error-icon">
                    ⚠
                </div>

                <h2>
                    Unable to load opportunity
                </h2>

                <p>
                    {error ||
                        "The opportunity could not be found."}
                </p>

                <button
                    onClick={() =>
                        navigate(
                            "/student/opportunities"
                        )
                    }
                >
                    Back to Opportunities
                </button>

            </div>
        );
    }


    // =====================================================
    // COMPANY
    // =====================================================

    const company =
        opportunity.company || {};

    const companyName =
        company.companyName ||
        opportunity.companyName ||
        "Company";

    const companyInitial =
        companyName
            .charAt(0)
            .toUpperCase();


    // =====================================================
    // DEADLINE
    // =====================================================

    const deadline =
        opportunity.applicationDeadline
            ? new Date(
                opportunity.applicationDeadline
            )
            : null;

    const isDeadlinePassed =
        deadline &&
        !Number.isNaN(
            deadline.getTime()
        ) &&
        new Date() >= deadline;


    // =====================================================
    // APPLY
    // =====================================================

    const handleApply = () => {

        if (isDeadlinePassed) {

            setSaveMessage(
                "Applications for this opportunity are closed."
            );

            return;
        }

        navigate(
            `/student/opportunities/${id}/apply`
        );
    };


    // =====================================================
    // TYPE / WORK MODE
    // =====================================================

    const jobType =
        opportunity.type ||
        "Opportunity";

    const workMode =
        opportunity.workMode ||
        "Not specified";


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="opportunity-details-page">

            <div className="opportunity-details-container">

                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    className="back-opportunities-button"
                    onClick={() =>
                        navigate(
                            "/student/opportunities"
                        )
                    }
                >
                    ← Back to Opportunities
                </button>


                {/* =================================================
                    JOB HEADER
                ================================================= */}

                <div className="job-header-card">

                    <div className="job-header-main">

                        <div className="opportunity-company-logo">
                            {companyInitial}
                        </div>

                        <div className="job-header-information">

                            <span className="job-company-name">
                                {companyName}
                            </span>

                            <h1>
                                {opportunity.title ||
                                    "Untitled Opportunity"}
                            </h1>

                            <p className="job-location">

                                {opportunity.location ||
                                    "Location not specified"}

                                <span>
                                    ·
                                </span>

                                {getPostedTime()}

                            </p>

                            <p className="job-application-info">

                                Applications through Nexly

                            </p>

                        </div>

                    </div>


                    {/* JOB TAGS */}

                    <div className="job-tags">

                        <span className="job-tag">

                            <span>
                                ◉
                            </span>

                            {workMode}

                        </span>

                        <span className="job-tag">

                            <span>
                                ◆
                            </span>

                            {jobType}

                        </span>

                        {opportunity.salary && (

                            <span className="job-tag">

                                <span>
                                    ₹
                                </span>

                                {opportunity.salary}

                            </span>

                        )}

                    </div>


                    {/* ACTIONS */}

                    <div className="job-actions">

                        {isDeadlinePassed ? (

                            <div className="application-closed-box">

                                <span className="closed-icon">
                                    🔒
                                </span>

                                <div>

                                    <strong>
                                        Applications Closed
                                    </strong>

                                    <span>
                                        The application deadline has passed.
                                    </span>

                                </div>

                            </div>

                        ) : (

                            <button
                                className="apply-opportunity-button"
                                onClick={handleApply}
                            >
                                Apply
                            </button>

                        )}

                        <button
                            className={`save-opportunity-button ${
                                isSaved
                                    ? "saved"
                                    : ""
                            }`}
                            onClick={handleSaveToggle}
                            disabled={saving}
                        >
                            {saving
                                ? "Please wait..."
                                : isSaved
                                    ? "♥ Saved"
                                    : "♡ Save"}
                        </button>

                    </div>

                </div>


                {/* =================================================
                    SAVE MESSAGE
                ================================================= */}

                {saveMessage && (
                    <div className="opportunity-save-message">
                        {saveMessage}
                    </div>
                )}


                {/* =================================================
                    MAIN GRID
                ================================================= */}

                <div className="job-content-layout">


                    {/* =================================================
                        LEFT CONTENT
                    ================================================= */}

                    <main className="job-main-content">


                        {/* =================================================
                            FIT CARD
                        ================================================= */}

                        <section className="job-fit-card">

                            <div className="fit-icon">
                                ✦
                            </div>

                            <div className="fit-content">

                                <h2>
                                    Determine your fit
                                </h2>

                                <p>
                                    See how your skills and profile
                                    align with this opportunity.
                                </p>

                            </div>

                            <button
                                className="fit-button"
                                onClick={() =>
                                    navigate(
                                        `/student/matching/${id}`
                                    )
                                }
                            >
                                Show match details
                                <span>
                                    →
                                </span>
                            </button>

                        </section>


                        {/* =================================================
                            ABOUT THE JOB
                        ================================================= */}

                        <section className="job-content-card">

                            <div className="section-heading">

                                <h2>
                                    About the job
                                </h2>

                            </div>

                            <div className="job-description">

                                {opportunity.description ? (

                                    <p>
                                        {opportunity.description}
                                    </p>

                                ) : (

                                    <p className="empty-content">
                                        No job description has been
                                        provided for this opportunity.
                                    </p>

                                )}

                            </div>

                        </section>


                        {/* =================================================
                            REQUIREMENTS
                        ================================================= */}

                        <section className="job-content-card">

                            <div className="section-heading">

                                <h2>
                                    Requirements
                                </h2>

                            </div>

                            <div className="job-description">

                                {opportunity.requirements ? (

                                    <p>
                                        {opportunity.requirements}
                                    </p>

                                ) : (

                                    <p className="empty-content">
                                        No specific requirements
                                        have been provided.
                                    </p>

                                )}

                            </div>

                        </section>


                        {/* =================================================
                            OPPORTUNITY DETAILS
                        ================================================= */}

                        <section className="job-content-card">

                            <div className="section-heading">

                                <h2>
                                    Job details
                                </h2>

                            </div>

                            <div className="job-details-grid">

                                <div className="job-detail-item">

                                    <span className="detail-icon">
                                        📍
                                    </span>

                                    <div>

                                        <span>
                                            Location
                                        </span>

                                        <strong>
                                            {opportunity.location ||
                                                "Not specified"}
                                        </strong>

                                    </div>

                                </div>


                                <div className="job-detail-item">

                                    <span className="detail-icon">
                                        💼
                                    </span>

                                    <div>

                                        <span>
                                            Work mode
                                        </span>

                                        <strong>
                                            {workMode}
                                        </strong>

                                    </div>

                                </div>


                                <div className="job-detail-item">

                                    <span className="detail-icon">
                                        ◆
                                    </span>

                                    <div>

                                        <span>
                                            Employment type
                                        </span>

                                        <strong>
                                            {jobType}
                                        </strong>

                                    </div>

                                </div>


                                <div
                                    className={`job-detail-item ${
                                        isDeadlinePassed
                                            ? "deadline-expired"
                                            : ""
                                    }`}
                                >

                                    <span className="detail-icon">
                                        📅
                                    </span>

                                    <div>

                                        <span>
                                            Application deadline
                                        </span>

                                        <strong>
                                            {formatDate(
                                                opportunity.applicationDeadline
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            ABOUT COMPANY
                        ================================================= */}

                        <section className="job-content-card">

                            <div className="section-heading">

                                <h2>
                                    About the company
                                </h2>

                            </div>

                            <div className="company-profile">

                                <div className="company-profile-logo">
                                    {companyInitial}
                                </div>

                                <div className="company-profile-info">

                                    <h3>
                                        {companyName}
                                    </h3>

                                    {company.industry && (

                                        <span className="company-industry">
                                            {company.industry}
                                        </span>

                                    )}

                                    {company.location && (

                                        <span className="company-location">
                                            📍 {company.location}
                                        </span>

                                    )}

                                    {company.website && (

                                        <a
                                            href={
                                                company.website.startsWith("http")
                                                    ? company.website
                                                    : `https://${company.website}`
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="company-website"
                                        >
                                            Visit company website →
                                        </a>

                                    )}

                                </div>

                            </div>

                            <div className="company-description">

                                <p>

                                    {company.description ||

                                        "Learn more about this company and explore career opportunities available through Nexly."}

                                </p>

                            </div>

                        </section>


                    </main>


                    {/* =================================================
                        RIGHT SIDEBAR
                    ================================================= */}

                    <aside className="job-sidebar">


                        {/* =================================================
                            APPLICATION CARD
                        ================================================= */}

                        <div className="sidebar-card">

                            <div className="sidebar-card-header">

                                <span className="sidebar-icon">
                                    📅
                                </span>

                                <div>

                                    <span>
                                        Application deadline
                                    </span>

                                    <strong>
                                        {formatDate(
                                            opportunity.applicationDeadline
                                        )}
                                    </strong>

                                </div>

                            </div>

                            {isDeadlinePassed ? (

                                <div className="sidebar-closed">
                                    Applications closed
                                </div>

                            ) : (

                                <button
                                    className="sidebar-apply-button"
                                    onClick={handleApply}
                                >
                                    Apply now →
                                </button>

                            )}

                        </div>


                        {/* =================================================
                            COMPANY SNAPSHOT
                        ================================================= */}

                        <div className="sidebar-card">

                            <h3>
                                About the company
                            </h3>

                            <div className="sidebar-company">

                                <div className="sidebar-company-logo">
                                    {companyInitial}
                                </div>

                                <div>

                                    <strong>
                                        {companyName}
                                    </strong>

                                    <span>
                                        {company.industry ||
                                            "Technology & Business"}
                                    </span>

                                </div>

                            </div>

                            {company.location && (

                                <div className="sidebar-info-row">
                                    <span>
                                        📍
                                    </span>

                                    <span>
                                        {company.location}
                                    </span>
                                </div>

                            )}

                            {company.website && (

                                <a
                                    href={
                                        company.website.startsWith("http")
                                            ? company.website
                                            : `https://${company.website}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="sidebar-link"
                                >
                                    View company website →
                                </a>

                            )}

                        </div>


                        {/* =================================================
                            NEXLY CAREER CARD
                        ================================================= */}

                        <div className="sidebar-card nexly-career-card">

                            <div className="nexly-card-mark">
                                N
                            </div>

                            <h3>
                                Build your career with Nexly
                            </h3>

                            <p>
                                Keep your profile, skills and resume
                                updated to improve your chances with
                                recruiters.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/student/profile"
                                    )
                                }
                            >
                                Improve my profile →
                            </button>

                        </div>


                    </aside>

                </div>

            </div>

        </div>
    );
}

export default OpportunityDetails;