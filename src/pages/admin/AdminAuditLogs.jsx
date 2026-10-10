import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./AdminAuditLogs.css";

function AdminAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("ALL");

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/audit-logs");

            setLogs(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Failed to load audit logs:", err);

            setError(
                err.response?.data?.error ||
                "Unable to load audit logs."
            );
        } finally {
            setLoading(false);
        }
    };

    const getValue = (log, keys, fallback = "—") => {
        for (const key of keys) {
            if (
                log[key] !== undefined &&
                log[key] !== null &&
                log[key] !== ""
            ) {
                return log[key];
            }
        }

        return fallback;
    };

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const action = String(
                getValue(log, ["action", "activity", "eventType"], "")
            );

            const user = String(
                getValue(
                    log,
                    ["userName", "username", "user", "performedBy"],
                    ""
                )
            );

            const email = String(
                getValue(log, ["userEmail", "email"], "")
            );

            const description = String(
                getValue(
                    log,
                    ["description", "details", "message"],
                    ""
                )
            );

            const matchesSearch =
                !search ||
                action.toLowerCase().includes(search.toLowerCase()) ||
                user.toLowerCase().includes(search.toLowerCase()) ||
                email.toLowerCase().includes(search.toLowerCase()) ||
                description.toLowerCase().includes(search.toLowerCase());

            const matchesAction =
                actionFilter === "ALL" ||
                action.toUpperCase() === actionFilter;

            return matchesSearch && matchesAction;
        });
    }, [logs, search, actionFilter]);

    const actions = [
        ...new Set(
            logs
                .map((log) =>
                    String(
                        getValue(
                            log,
                            ["action", "activity", "eventType"],
                            ""
                        )
                    ).toUpperCase()
                )
                .filter(Boolean)
        ),
    ];

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString();
    };

    const getActionClass = (action) => {
        const value = String(action).toLowerCase();

        if (
            value.includes("delete") ||
            value.includes("reject") ||
            value.includes("deactivate")
        ) {
            return "audit-danger";
        }

        if (
            value.includes("create") ||
            value.includes("register") ||
            value.includes("activate")
        ) {
            return "audit-success";
        }

        if (
            value.includes("update") ||
            value.includes("edit")
        ) {
            return "audit-warning";
        }

        return "audit-info";
    };

    return (
        <div className="admin-audit-page">

            <div className="admin-audit-header">
                <div>
                    <span className="admin-audit-eyebrow">
                        PLATFORM MONITORING
                    </span>

                    <h1>Audit Logs</h1>

                    <p>
                        Track important activities and actions performed
                        across the Nexly platform.
                    </p>
                </div>

                <button
                    className="audit-refresh-btn"
                    onClick={fetchAuditLogs}
                >
                    ↻ Refresh
                </button>
            </div>

            <div className="audit-stats">

                <div className="audit-stat-card">
                    <div className="audit-stat-icon">📋</div>
                    <div>
                        <span>Total Logs</span>
                        <strong>{logs.length}</strong>
                    </div>
                </div>

                <div className="audit-stat-card">
                    <div className="audit-stat-icon">⚡</div>
                    <div>
                        <span>Filtered Results</span>
                        <strong>{filteredLogs.length}</strong>
                    </div>
                </div>

                <div className="audit-stat-card">
                    <div className="audit-stat-icon">🔐</div>
                    <div>
                        <span>Action Types</span>
                        <strong>{actions.length}</strong>
                    </div>
                </div>

            </div>

            <div className="audit-toolbar">

                <div className="audit-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search logs, users or actions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                >
                    <option value="ALL">All Actions</option>

                    {actions.map((action) => (
                        <option key={action} value={action}>
                            {action}
                        </option>
                    ))}
                </select>

            </div>

            {loading ? (
                <div className="audit-state">
                    <div className="audit-spinner"></div>
                    <p>Loading audit logs...</p>
                </div>
            ) : error ? (
                <div className="audit-error">
                    <div className="audit-error-icon">!</div>

                    <h3>Unable to load audit logs</h3>

                    <p>{error}</p>

                    <button onClick={fetchAuditLogs}>
                        Try Again
                    </button>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="audit-empty">

                    <div className="audit-empty-icon">
                        📋
                    </div>

                    <h3>No audit logs found</h3>

                    <p>
                        There are no activities matching your current
                        search or filter.
                    </p>

                </div>
            ) : (
                <div className="audit-table-card">

                    <div className="audit-table-wrapper">

                        <table className="audit-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Action</th>
                                    <th>User</th>
                                    <th>Description</th>
                                    <th>Date & Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredLogs.map((log, index) => {

                                    const id = getValue(
                                        log,
                                        ["id"],
                                        index + 1
                                    );

                                    const action = getValue(
                                        log,
                                        [
                                            "action",
                                            "activity",
                                            "eventType"
                                        ]
                                    );

                                    const user = getValue(
                                        log,
                                        [
                                            "userName",
                                            "username",
                                            "user",
                                            "performedBy"
                                        ]
                                    );

                                    const email = getValue(
                                        log,
                                        [
                                            "userEmail",
                                            "email"
                                        ],
                                        ""
                                    );

                                    const description = getValue(
                                        log,
                                        [
                                            "description",
                                            "details",
                                            "message"
                                        ]
                                    );

                                    const date = getValue(
                                        log,
                                        [
                                            "createdAt",
                                            "timestamp",
                                            "date",
                                            "performedAt"
                                        ]
                                    );

                                    return (
                                        <tr key={id}>

                                            <td>
                                                <span className="audit-id">
                                                    #{id}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`audit-action ${getActionClass(
                                                        action
                                                    )}`}
                                                >
                                                    {action}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="audit-user">

                                                    <div className="audit-avatar">
                                                        {String(user)
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {user}
                                                        </strong>

                                                        {email && (
                                                            <small>
                                                                {email}
                                                            </small>
                                                        )}
                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                <span className="audit-description">
                                                    {description}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="audit-date">
                                                    {formatDate(date)}
                                                </span>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminAuditLogs;
