import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./AdminCompanies.css";

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(null);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/companies");

            setCompanies(response.data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to load companies."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleDelete = async (company) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${company.companyName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(company.id);
            setError("");

            await api.delete(`/admin/companies/${company.id}`);

            setCompanies((currentCompanies) =>
                currentCompanies.filter(
                    (item) => item.id !== company.id
                )
            );

            if (selectedCompany?.id === company.id) {
                setSelectedCompany(null);
            }
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to delete company."
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredCompanies = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        if (!searchText) {
            return companies;
        }

        return companies.filter((company) => {
            return (
                company.companyName
                    ?.toLowerCase()
                    .includes(searchText) ||
                company.industry
                    ?.toLowerCase()
                    .includes(searchText) ||
                company.location
                    ?.toLowerCase()
                    .includes(searchText) ||
                company.recruiterName
                    ?.toLowerCase()
                    .includes(searchText) ||
                company.recruiterEmail
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });
    }, [companies, search]);

    const industries = new Set(
        companies
            .map((company) => company.industry)
            .filter(Boolean)
    );

    const locations = new Set(
        companies
            .map((company) => company.location)
            .filter(Boolean)
    );

    const getInitial = (companyName) => {
        if (!companyName) {
            return "C";
        }

        return companyName
            .trim()
            .charAt(0)
            .toUpperCase();
    };

    return (
        <div className="admin-companies-page">

            {/* ================= HEADER ================= */}

            <div className="admin-companies-header">

                <div>
                    <div className="admin-company-breadcrumb">
                        Admin <span>/</span> Company Management
                    </div>

                    <h1>Company Management</h1>

                    <p>
                        Monitor and manage companies registered on Nexly.
                    </p>
                </div>

                <button
                    className="refresh-companies-btn"
                    onClick={fetchCompanies}
                    disabled={loading}
                >
                    <span>↻</span>
                    Refresh
                </button>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="admin-company-error">
                    <span className="error-icon">⚠</span>

                    <span>{error}</span>

                    <button onClick={() => setError("")}>
                        ×
                    </button>
                </div>
            )}

            {/* ================= STATISTICS ================= */}

            <div className="company-stat-grid">

                <div className="company-stat-card">

                    <div className="company-stat-icon total">
                        🏢
                    </div>

                    <div>
                        <span>Total Companies</span>
                        <strong>{companies.length}</strong>
                    </div>

                </div>

                <div className="company-stat-card">

                    <div className="company-stat-icon industry">
                        ◈
                    </div>

                    <div>
                        <span>Industries</span>
                        <strong>{industries.size}</strong>
                    </div>

                </div>

                <div className="company-stat-card">

                    <div className="company-stat-icon location">
                        📍
                    </div>

                    <div>
                        <span>Locations</span>
                        <strong>{locations.size}</strong>
                    </div>

                </div>

                <div className="company-stat-card">

                    <div className="company-stat-icon recruiters">
                        👤
                    </div>

                    <div>
                        <span>Recruiters</span>
                        <strong>
                            {
                                new Set(
                                    companies
                                        .map(
                                            (company) =>
                                                company.recruiterId
                                        )
                                        .filter(Boolean)
                                ).size
                            }
                        </strong>
                    </div>

                </div>

            </div>

            {/* ================= MAIN CARD ================= */}

            <div className="companies-management-card">

                {/* TOOLBAR */}

                <div className="companies-toolbar">

                    <div className="companies-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search company, industry, location or recruiter..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                        {search && (
                            <button
                                className="clear-company-search"
                                onClick={() => setSearch("")}
                            >
                                ×
                            </button>
                        )}

                    </div>

                </div>

                {/* RESULT COUNT */}

                <div className="companies-result-info">
                    Showing{" "}
                    <strong>{filteredCompanies.length}</strong>{" "}
                    of{" "}
                    <strong>{companies.length}</strong>{" "}
                    companies
                </div>

                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="companies-loading">

                        <div className="company-loading-spinner"></div>

                        <p>Loading companies...</p>

                    </div>

                ) : filteredCompanies.length === 0 ? (

                    /* ================= EMPTY ================= */

                    <div className="companies-empty">

                        <div className="companies-empty-icon">
                            🏢
                        </div>

                        <h3>No companies found</h3>

                        <p>
                            {search
                                ? "Try changing your search."
                                : "No companies have been registered yet."}
                        </p>

                    </div>

                ) : (

                    /* ================= COMPANY GRID ================= */

                    <div className="companies-grid">

                        {filteredCompanies.map((company) => (

                            <div
                                className="company-card"
                                key={company.id}
                            >

                                {/* COMPANY HEADER */}

                                <div className="company-card-header">

                                    <div className="company-logo">
                                        {getInitial(
                                            company.companyName
                                        )}
                                    </div>

                                    <div className="company-title">

                                        <h3>
                                            {company.companyName ||
                                                "Unnamed Company"}
                                        </h3>

                                        <span>
                                            Company ID #{company.id}
                                        </span>

                                    </div>

                                </div>

                                {/* COMPANY DETAILS */}

                                <div className="company-details">

                                    <div className="company-detail">

                                        <span className="detail-icon">
                                            ◈
                                        </span>

                                        <div>
                                            <small>Industry</small>
                                            <strong>
                                                {company.industry ||
                                                    "Not specified"}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="company-detail">

                                        <span className="detail-icon">
                                            📍
                                        </span>

                                        <div>
                                            <small>Location</small>
                                            <strong>
                                                {company.location ||
                                                    "Not specified"}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="company-detail">

                                        <span className="detail-icon">
                                            👤
                                        </span>

                                        <div>
                                            <small>Recruiter</small>
                                            <strong>
                                                {company.recruiterName ||
                                                    "Unknown"}
                                            </strong>

                                            <small>
                                                {company.recruiterEmail ||
                                                    ""}
                                            </small>
                                        </div>

                                    </div>

                                </div>

                                {/* DESCRIPTION */}

                                <div className="company-description">

                                    <span>About company</span>

                                    <p>
                                        {company.description
                                            ? company.description
                                            : "No company description provided."}
                                    </p>

                                </div>

                                {/* FOOTER */}

                                <div className="company-card-footer">

                                    {company.website ? (
                                        <a
                                            href={
                                                company.website.startsWith(
                                                    "http"
                                                )
                                                    ? company.website
                                                    : `https://${company.website}`
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="company-website"
                                        >
                                            🌐 Visit Website
                                        </a>
                                    ) : (
                                        <span className="no-website">
                                            No website
                                        </span>
                                    )}

                                    <div className="company-actions">

                                        <button
                                            className="view-company-btn"
                                            onClick={() =>
                                                setSelectedCompany(
                                                    company
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className="delete-company-btn"
                                            onClick={() =>
                                                handleDelete(company)
                                            }
                                            disabled={
                                                deleteLoading ===
                                                company.id
                                            }
                                        >
                                            {deleteLoading === company.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* ================= DETAILS MODAL ================= */}

            {selectedCompany && (

                <div
                    className="company-modal-overlay"
                    onClick={() => setSelectedCompany(null)}
                >

                    <div
                        className="company-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="company-modal-header">

                            <div>
                                <span>Company Details</span>

                                <h2>
                                    {selectedCompany.companyName}
                                </h2>
                            </div>

                            <button
                                className="close-company-modal"
                                onClick={() =>
                                    setSelectedCompany(null)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="company-modal-body">

                            <div className="modal-company-logo">
                                {getInitial(
                                    selectedCompany.companyName
                                )}
                            </div>

                            <div className="modal-info-grid">

                                <div>
                                    <span>Industry</span>
                                    <strong>
                                        {selectedCompany.industry ||
                                            "Not specified"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Location</span>
                                    <strong>
                                        {selectedCompany.location ||
                                            "Not specified"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Recruiter</span>
                                    <strong>
                                        {selectedCompany.recruiterName ||
                                            "Unknown"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Recruiter Email</span>
                                    <strong>
                                        {selectedCompany.recruiterEmail ||
                                            "Unknown"}
                                    </strong>
                                </div>

                                <div className="modal-full-width">
                                    <span>Website</span>

                                    {selectedCompany.website ? (
                                        <a
                                            href={
                                                selectedCompany.website.startsWith(
                                                    "http"
                                                )
                                                    ? selectedCompany.website
                                                    : `https://${selectedCompany.website}`
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {selectedCompany.website}
                                        </a>
                                    ) : (
                                        <strong>
                                            Not provided
                                        </strong>
                                    )}
                                </div>

                                <div className="modal-full-width">

                                    <span>
                                        Description
                                    </span>

                                    <p>
                                        {selectedCompany.description ||
                                            "No description provided."}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="company-modal-footer">

                            <button
                                className="modal-close-btn"
                                onClick={() =>
                                    setSelectedCompany(null)
                                }
                            >
                                Close
                            </button>

                            <button
                                className="modal-delete-btn"
                                onClick={() =>
                                    handleDelete(
                                        selectedCompany
                                    )
                                }
                                disabled={
                                    deleteLoading ===
                                    selectedCompany.id
                                }
                            >
                                {deleteLoading === selectedCompany.id
                                    ? "Deleting..."
                                    : "Delete Company"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminCompanies;