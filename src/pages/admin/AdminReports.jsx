
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./AdminReports.css";

function AdminReports() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/reports");
            setReport(response.data);
        } catch (err) {
            console.error("Unable to load reports:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to load platform reports. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const sections = useMemo(() => {
        if (!report || typeof report !== "object") {
            return [];
        }

        const ignoredKeys = new Set([
            "message", "status", "generatedAt"
        ]);

        return Object.entries(report)
            .filter(([key, value]) =>
                !ignoredKeys.has(key) &&
                value !== null &&
                typeof value === "object"
            )
            .map(([key, value]) => ({
                title: key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/[_-]/g, " ")
                    .replace(/^./, (c) => c.toUpperCase()),
                rows: Array.isArray(value)
                    ? value
                    : Object.entries(value).map(([label, count]) => ({
                        category: label,
                        count
                    }))
            }))
            .filter((section) => section.rows.length > 0);
    }, [report]);

    const metrics = useMemo(() => {
        if (!report || typeof report !== "object") {
            return [];
        }

        const aliases = [
            {
                title: "Total Users",
                keys: ["totalUsers", "userCount", "users"]
            },
            {
                title: "Students",
                keys: ["totalStudents", "studentCount", "students"]
            },
            {
                title: "Recruiters",
                keys: ["totalRecruiters", "recruiterCount", "recruiters"]
            },
            {
                title: "Opportunities",
                keys: [
                    "totalOpportunities",
                    "opportunityCount",
                    "opportunities"
                ]
            },
            {
                title: "Applications",
                keys: ["totalApplications", "applicationCount", "applications"]
            },
            {
                title: "Selected",
                keys: ["selectedApplications", "totalSelected", "selected"]
            }
        ];

        return aliases
            .map((metric) => {
                const key = metric.keys.find(
                    (candidate) =>
                        typeof report[candidate] === "number"
                );

                return key
                    ? { title: metric.title, value: report[key] }
                    : null;
            })
            .filter(Boolean);
    }, [report]);

    const formatLabel = (value) =>
        String(value)
            .replace(/([A-Z])/g, " $1")
            .replace(/[_-]/g, " ")
            .replace(/^./, (c) => c.toUpperCase());

    const formatValue = (value) => {
        if (value === null || value === undefined) return "—";

        if (typeof value === "object") {
            return JSON.stringify(value);
        }

        return String(value);
    };

    const exportCSV = () => {
        if (!report) return;

        const rows = [];

        const addRow = (section, key, value) => {
            rows.push([section, key, formatValue(value)]);
        };

        Object.entries(report).forEach(([key, value]) => {
            if (
                value === null ||
                typeof value !== "object"
            ) {
                addRow("Summary", key, value);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (item && typeof item === "object") {
                        Object.entries(item).forEach(
                            ([field, fieldValue]) =>
                                addRow(key, `${index + 1} - ${field}`, fieldValue)
                        );
                    } else {
                        addRow(key, index + 1, item);
                    }
                });
            } else {
                Object.entries(value).forEach(([field, fieldValue]) =>
                    addRow(key, field, fieldValue)
                );
            }
        });

        const escapeCell = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const csv = [
            ["Report Section", "Metric", "Value"],
            ...rows
        ]
            .map((row) => row.map(escapeCell).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "nexly-platform-report.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <main className="admin-reports-page">
            <header className="reports-header">
                <div>
                    <span className="reports-eyebrow">
                        PLATFORM ANALYTICS
                    </span>

                    <h1>Reports & Analytics</h1>

                    <p>
                        Monitor Nexly's users, opportunities,
                        applications and platform activity.
                    </p>
                </div>

                <div className="reports-actions">
                    <button
                        className="reports-refresh"
                        onClick={fetchReports}
                        disabled={loading}
                    >
                        ↻ Refresh
                    </button>

                    <button
                        className="reports-export"
                        onClick={exportCSV}
                        disabled={!report || loading}
                    >
                        ↓ Export CSV
                    </button>
                </div>
            </header>

            {loading ? (
                <section className="reports-state">
                    <div className="reports-spinner" />
                    <h3>Generating reports...</h3>
                    <p>Loading the latest platform statistics.</p>
                </section>
            ) : error ? (
                <section className="reports-state reports-error">
                    <div className="reports-state-icon">!</div>
                    <h3>Reports unavailable</h3>
                    <p>{error}</p>
                    <button onClick={fetchReports}>
                        Try Again
                    </button>
                </section>
            ) : !report || typeof report !== "object" ? (
                <section className="reports-state">
                    <h3>No report data available</h3>
                    <p>The server did not return a report object.</p>
                </section>
            ) : (
                <>
                    <section className="reports-summary">
                        <div className="reports-summary-card">
                            <span>Report Status</span>
                            <strong className="reports-status">
                                <i />
                                Data Loaded
                            </strong>
                        </div>

                        <div className="reports-summary-card">
                            <span>Summary Metrics</span>
                            <strong>{metrics.length}</strong>
                        </div>

                        <div className="reports-summary-card">
                            <span>Report Sections</span>
                            <strong>{sections.length}</strong>
                        </div>
                    </section>

                    {metrics.length > 0 && (
                        <section className="reports-metrics">
                            {metrics.map((metric) => (
                                <article
                                    className="reports-metric-card"
                                    key={metric.title}
                                >
                                    <span>{metric.title}</span>
                                    <strong>
                                        {metric.value.toLocaleString()}
                                    </strong>
                                    <small>Current reported total</small>
                                </article>
                            ))}
                        </section>
                    )}

                    <section className="reports-data-section">
                        <div className="reports-section-heading">
                            <div>
                                <h2>Report Details</h2>
                                <p>
                                    Breakdown of the data returned by
                                    the Nexly reporting service.
                                </p>
                            </div>
                        </div>

                        {sections.length > 0 ? (
                            <div className="reports-sections">
                                {sections.map((section) => (
                                    <article
                                        className="reports-detail-card"
                                        key={section.title}
                                    >
                                        <h3>{section.title}</h3>

                                        <div className="reports-table-wrapper">
                                            <table className="reports-table">
                                                <thead>
                                                    <tr>
                                                        <th>Category / Field</th>
                                                        <th>Value</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {section.rows.map(
                                                        (item, index) => {
                                                            const isObject =
                                                                item !== null &&
                                                                typeof item === "object";

                                                            const entries = isObject
                                                                ? Object.entries(item)
                                                                : [["Value", item]];

                                                            return entries.map(
                                                                ([key, value], fieldIndex) => (
                                                                    <tr
                                                                        key={`${index}-${key}`}
                                                                    >
                                                                        <td>
                                                                            {formatLabel(key)}
                                                                        </td>
                                                                        <td>
                                                                            {formatValue(value)}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="reports-detail-card">
                                <h3>Summary Data</h3>

                                <div className="reports-table-wrapper">
                                    <table className="reports-table">
                                        <thead>
                                            <tr>
                                                <th>Metric</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {Object.entries(report)
                                                .filter(
                                                    ([, value]) =>
                                                        value === null ||
                                                        typeof value !== "object"
                                                )
                                                .map(([key, value]) => (
                                                    <tr key={key}>
                                                        <td>{formatLabel(key)}</td>
                                                        <td>{formatValue(value)}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>

                    <p className="reports-footer">
                        Exported data reflects the response currently
                        provided by the Nexly backend.
                    </p>
                </>
            )}
        </main>
    );
}

export default AdminReports;