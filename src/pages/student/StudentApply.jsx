import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "./StudentApply.css";

function StudentApply() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [opportunity, setOpportunity] = useState(null);

    const [coverLetter, setCoverLetter] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD OPPORTUNITY
    // =====================================================

    useEffect(() => {

        loadOpportunity();

    }, [id]);


    const loadOpportunity = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    `/opportunities/${id}`
                );

            setOpportunity(
                response.data
            );

        } catch (err) {

            console.error(
                "Opportunity loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load this opportunity."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // DEADLINE CHECK
    // =====================================================

    const deadline =
        opportunity?.applicationDeadline
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
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Not specified";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
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
    // SUBMIT APPLICATION
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        // Frontend deadline protection
        if (isDeadlinePassed) {

            setError(
                "The application deadline has passed. Applications are closed."
            );

            return;
        }


        if (!coverLetter.trim()) {

            setError(
                "Please enter a cover letter before applying."
            );

            return;
        }


        try {

            setSubmitting(true);
            setError("");
            setSuccess("");


            await api.post(
                "/applications",
                {
                    opportunityId:
                        Number(id),

                    coverLetter:
                        coverLetter.trim(),

                    resumeUrl:
                        resumeUrl.trim(),
                }
            );


            setSuccess(
                "Your application has been submitted successfully."
            );


            setTimeout(() => {

                navigate(
                    "/student/applications"
                );

            }, 1200);


        } catch (err) {

            console.error(
                "Application submission error:",
                err
            );


            const backendMessage =
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.response?.data?.message;


            setError(
                backendMessage ||
                "Unable to submit your application."
            );


        } finally {

            setSubmitting(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="student-apply-page">

                <div className="student-apply-loading">
                    <Loading />
                </div>

            </div>
        );
    }


    // =====================================================
    // LOAD ERROR
    // =====================================================

    if (error && !opportunity) {

        return (

            <div className="student-apply-page">

                <div className="apply-error-page">

                    <div className="apply-error-icon">
                        ⚠
                    </div>

                    <h2>
                        Unable to load opportunity
                    </h2>

                    <p>
                        {error}
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

            </div>
        );
    }


    // =====================================================
    // COMPANY
    // =====================================================

    const companyName =
        opportunity?.company?.companyName ||
        opportunity?.companyName ||
        "Company";


    const companyInitial =
        companyName
            .charAt(0)
            .toUpperCase();


    // =====================================================
    // APPLICATION CLOSED PAGE
    // =====================================================

    if (isDeadlinePassed) {

        return (

            <div className="student-apply-page">

                <div className="apply-container">

                    <div className="apply-header">

                        <button
                            className="back-button"
                            onClick={() =>
                                navigate(
                                    `/student/opportunities/${id}`
                                )
                            }
                        >
                            ← Back to Opportunity
                        </button>

                        <span className="apply-eyebrow">
                            APPLICATION
                        </span>

                        <h1>
                            Applications Closed
                        </h1>

                        <p>
                            The application deadline for
                            this opportunity has passed.
                        </p>

                    </div>


                    <div className="application-closed-card">

                        <div className="closed-card-icon">
                            🔒
                        </div>

                        <div className="closed-card-content">

                            <h2>
                                This opportunity is no longer accepting applications
                            </h2>

                            <p>
                                The application deadline was{" "}
                                <strong>
                                    {formatDate(
                                        opportunity.applicationDeadline
                                    )}
                                </strong>.
                            </p>

                            <p>
                                You can explore other opportunities
                                available on Nexly.
                            </p>

                            <button
                                className="closed-back-button"
                                onClick={() =>
                                    navigate(
                                        "/student/opportunities"
                                    )
                                }
                            >
                                Explore Other Opportunities →
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // NORMAL APPLICATION PAGE
    // =====================================================

    return (

        <div className="student-apply-page">

            <div className="apply-container">

                {/* HEADER */}

                <div className="apply-header">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(
                                `/student/opportunities/${id}`
                            )
                        }
                    >
                        ← Back to Opportunity
                    </button>

                    <span className="apply-eyebrow">
                        APPLICATION
                    </span>

                    <h1>
                        Apply for this opportunity
                    </h1>

                    <p>
                        Submit your application and take
                        the next step in your career journey.
                    </p>

                </div>


                {/* OPPORTUNITY SUMMARY */}

                <div className="apply-opportunity-card">

                    <div className="apply-company-logo">
                        {companyInitial}
                    </div>

                    <div>

                        <h2>
                            {opportunity?.title ||
                                "Opportunity"}
                        </h2>

                        <p>
                            {companyName}
                        </p>

                        <div className="apply-opportunity-meta">

                            {opportunity?.location && (

                                <span>
                                    📍{" "}
                                    {opportunity.location}
                                </span>

                            )}

                            {opportunity?.workMode && (

                                <span>
                                    💼{" "}
                                    {opportunity.workMode}
                                </span>

                            )}

                            {opportunity?.type && (

                                <span>
                                    ◆{" "}
                                    {opportunity.type}
                                </span>

                            )}

                        </div>

                    </div>

                </div>


                {/* DEADLINE */}

                <div className="application-deadline-info">

                    <span className="deadline-info-icon">
                        📅
                    </span>

                    <div>

                        <span>
                            Application Deadline
                        </span>

                        <strong>
                            {formatDate(
                                opportunity.applicationDeadline
                            )}
                        </strong>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="apply-form-error">
                        ⚠ {error}
                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="apply-form-success">
                        ✓ {success}
                    </div>

                )}


                {/* FORM */}

                <form
                    className="application-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-section">

                        <div className="form-section-header">

                            <span>
                                01
                            </span>

                            <div>

                                <h2>
                                    Cover Letter
                                </h2>

                                <p>
                                    Tell the recruiter why
                                    you're a good fit.
                                </p>

                            </div>

                        </div>


                        <textarea
                            value={coverLetter}
                            onChange={(event) =>
                                setCoverLetter(
                                    event.target.value
                                )
                            }
                            placeholder="Introduce yourself, explain your relevant skills, experience, and why you're interested in this opportunity..."
                            rows="9"
                            maxLength="3000"
                            required
                        />


                        <div className="character-count">
                            {coverLetter.length}/3000
                        </div>

                    </div>


                    <div className="form-section">

                        <div className="form-section-header">

                            <span>
                                02
                            </span>

                            <div>

                                <h2>
                                    Resume
                                </h2>

                                <p>
                                    Add the link to your resume.
                                </p>

                            </div>

                        </div>


                        <input
                            type="url"
                            value={resumeUrl}
                            onChange={(event) =>
                                setResumeUrl(
                                    event.target.value
                                )
                            }
                            placeholder="https://drive.google.com/... or your resume URL"
                        />


                        <small className="resume-help">
                            Make sure the recruiter can access
                            the resume using this link.
                        </small>

                    </div>


                    <div className="application-submit-section">

                        <div>

                            <strong>
                                Ready to apply?
                            </strong>

                            <p>
                                Review your information before
                                submitting your application.
                            </p>

                        </div>


                        <button
                            type="submit"
                            disabled={submitting}
                        >

                            {submitting
                                ? "Submitting..."
                                : "Submit Application →"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default StudentApply;