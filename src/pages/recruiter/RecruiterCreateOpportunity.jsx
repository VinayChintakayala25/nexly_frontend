import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./RecruiterCreateOpportunity.css";

function RecruiterCreateOpportunity() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        type: "",
        location: "",
        workMode: "",
        description: "",
        requirements: "",
        salary: "",
        applicationDeadline: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // ============================================
        // BASIC VALIDATION
        // ============================================

        if (!formData.title.trim()) {
            setError("Opportunity title is required.");
            return;
        }

        if (!formData.type) {
            setError("Please select an opportunity type.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Opportunity description is required.");
            return;
        }

        try {

            setLoading(true);

            const payload = {
                title: formData.title.trim(),
                type: formData.type,
                location: formData.location.trim(),
                workMode: formData.workMode,
                description: formData.description.trim(),
                requirements: formData.requirements.trim(),
                salary: formData.salary.trim(),
                applicationDeadline:
                    formData.applicationDeadline
                        ? formData.applicationDeadline + ":00"
                        : null,
            };

            await api.post(
                "/recruiter/opportunities",
                payload
            );

            setSuccess(
                "Opportunity published successfully."
            );

            // Clear form
            setFormData({
                title: "",
                type: "",
                location: "",
                workMode: "",
                description: "",
                requirements: "",
                salary: "",
                applicationDeadline: "",
            });

            // Go back to recruiter dashboard
            setTimeout(() => {
                navigate("/recruiter");
            }, 1000);

        } catch (err) {

            console.error(
                "Create opportunity error:",
                err
            );

            setError(
                err?.response?.data ||
                err?.response?.data?.message ||
                "Unable to create opportunity. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="create-opportunity-page">

            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <div className="create-opportunity-header">

                <div>

                    <span className="create-page-label">
                        RECRUITER PORTAL
                    </span>

                    <h1>
                        Create Opportunity
                    </h1>

                    <p>
                        Publish a job, internship or project
                        for students to discover.
                    </p>

                </div>

                <button
                    type="button"
                    className="back-dashboard-button"
                    onClick={() =>
                        navigate("/recruiter")
                    }
                >
                    ← Dashboard
                </button>

            </div>


            {/* =========================================
                FORM CARD
            ========================================= */}

            <div className="create-opportunity-card">

                <div className="form-card-heading">

                    <div className="form-heading-icon">
                        +
                    </div>

                    <div>

                        <h2>
                            Opportunity Information
                        </h2>

                        <p>
                            Add the details candidates need
                            to understand this opportunity.
                        </p>

                    </div>

                </div>


                {/* =====================================
                    SUCCESS
                ===================================== */}

                {success && (
                    <div className="form-success">
                        <span>✓</span>
                        <p>{success}</p>
                    </div>
                )}


                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (
                    <div className="form-error">
                        <span>!</span>
                        <p>{error}</p>
                    </div>
                )}


                <form
                    className="opportunity-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================
                        TITLE
                    ================================= */}

                    <div className="form-field full-width">

                        <label htmlFor="title">
                            Opportunity Title
                            <span className="required">
                                *
                            </span>
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g. Full Stack Java Developer Intern"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        TYPE
                    ================================= */}

                    <div className="form-field">

                        <label htmlFor="type">
                            Opportunity Type
                            <span className="required">
                                *
                            </span>
                        </label>

                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            disabled={loading}
                        >

                            <option value="">
                                Select type
                            </option>

                            <option value="JOB">
                                Full-time Job
                            </option>

                            <option value="INTERNSHIP">
                                Internship
                            </option>

                            <option value="PROJECT">
                                Project
                            </option>

                        </select>

                    </div>


                    {/* =================================
                        WORK MODE
                    ================================= */}

                    <div className="form-field">

                        <label htmlFor="workMode">
                            Work Mode
                        </label>

                        <select
                            id="workMode"
                            name="workMode"
                            value={formData.workMode}
                            onChange={handleChange}
                            disabled={loading}
                        >

                            <option value="">
                                Select work mode
                            </option>

                            <option value="ONSITE">
                                On-site
                            </option>

                            <option value="REMOTE">
                                Remote
                            </option>

                            <option value="HYBRID">
                                Hybrid
                            </option>

                        </select>

                    </div>


                    {/* =================================
                        LOCATION
                    ================================= */}

                    <div className="form-field">

                        <label htmlFor="location">
                            Location
                        </label>

                        <input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="e.g. Hyderabad, Telangana"
                            value={formData.location}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        SALARY
                    ================================= */}

                    <div className="form-field">

                        <label htmlFor="salary">
                            Salary / Stipend
                        </label>

                        <input
                            id="salary"
                            name="salary"
                            type="text"
                            placeholder="e.g. ₹25,000/month"
                            value={formData.salary}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        DEADLINE
                    ================================= */}

                    <div className="form-field">

                        <label htmlFor="applicationDeadline">
                            Application Deadline
                        </label>

                        <input
                            id="applicationDeadline"
                            name="applicationDeadline"
                            type="datetime-local"
                            value={formData.applicationDeadline}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        DESCRIPTION
                    ================================= */}

                    <div className="form-field full-width">

                        <label htmlFor="description">
                            Description
                            <span className="required">
                                *
                            </span>
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="6"
                            placeholder="Describe the opportunity, responsibilities and what the candidate will work on..."
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <span className="field-hint">
                            Explain what candidates will do in this role.
                        </span>

                    </div>


                    {/* =================================
                        REQUIREMENTS
                    ================================= */}

                    <div className="form-field full-width">

                        <label htmlFor="requirements">
                            Requirements
                        </label>

                        <textarea
                            id="requirements"
                            name="requirements"
                            rows="6"
                            placeholder="e.g. Java, Spring Boot, React, SQL, Git, problem-solving..."
                            value={formData.requirements}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <span className="field-hint">
                            Add the skills, qualifications or experience
                            candidates should have.
                        </span>

                    </div>


                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/recruiter")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="publish-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="create-spinner" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    Publish Opportunity
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default RecruiterCreateOpportunity;