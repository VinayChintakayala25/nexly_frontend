import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./RecruiterCompany.css";

function RecruiterCompany() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        website: "",
        location: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadCompany();
    }, []);

    const loadCompany = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/recruiter/company");

            if (response.data) {
                setFormData({
                    companyName: response.data.companyName || "",
                    industry: response.data.industry || "",
                    website: response.data.website || "",
                    location: response.data.location || "",
                    description: response.data.description || "",
                });
            }
        } catch (err) {
            if (err.response?.status !== 404) {
                console.error("Company loading error:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load company profile."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!formData.companyName.trim()) {
            setError("Company name is required.");
            return;
        }

        try {
            setSaving(true);

            await api.post("/recruiter/company", {
                companyName: formData.companyName.trim(),
                industry: formData.industry.trim(),
                website: formData.website.trim(),
                location: formData.location.trim(),
                description: formData.description.trim(),
            });

            setMessage("Company profile saved successfully.");

            setTimeout(() => {
                navigate("/recruiter");
            }, 1000);

        } catch (err) {
            console.error("Company save error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to save company profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="recruiter-company-page">
                <div className="company-loading">
                    <div className="company-spinner"></div>
                    <p>Loading company profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recruiter-company-page">

            <div className="company-page-header">
                <div>
                    <span className="company-page-label">
                        RECRUITER PORTAL
                    </span>

                    <h1>Company Profile</h1>

                    <p>
                        Set up your company information before creating
                        opportunities.
                    </p>
                </div>

                <button
                    type="button"
                    className="back-dashboard-button"
                    onClick={() => navigate("/recruiter")}
                >
                    ← Dashboard
                </button>
            </div>

            <div className="company-form-card">

                <div className="company-form-heading">
                    <div className="company-form-icon">
                        ◈
                    </div>

                    <div>
                        <h2>Company Information</h2>
                        <p>
                            This information will be visible to students
                            viewing your opportunities.
                        </p>
                    </div>
                </div>

                {message && (
                    <div className="company-success">
                        ✓ {message}
                    </div>
                )}

                {error && (
                    <div className="company-error">
                        ! {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="company-form-grid">

                        <div className="company-form-group full-width">
                            <label htmlFor="companyName">
                                Company Name *
                            </label>

                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                required
                            />
                        </div>

                        <div className="company-form-group">
                            <label htmlFor="industry">
                                Industry
                            </label>

                            <input
                                id="industry"
                                name="industry"
                                type="text"
                                value={formData.industry}
                                onChange={handleChange}
                                placeholder="e.g. Information Technology"
                            />
                        </div>

                        <div className="company-form-group">
                            <label htmlFor="website">
                                Website
                            </label>

                            <input
                                id="website"
                                name="website"
                                type="text"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="company-form-group full-width">
                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Hyderabad, Telangana"
                            />
                        </div>

                        <div className="company-form-group full-width">
                            <label htmlFor="description">
                                Company Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell students about your company..."
                                rows="6"
                            />
                        </div>

                    </div>

                    <div className="company-form-actions">

                        <button
                            type="button"
                            className="company-cancel-button"
                            onClick={() => navigate("/recruiter")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="company-save-button"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Company Profile"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default RecruiterCompany;