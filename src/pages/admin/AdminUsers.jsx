import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./AdminUsers.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");
            setUsers(response.data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusChange = async (user) => {
        try {
            setActionLoading(user.id);
            setError("");

            if (user.active) {
                await api.put(`/admin/users/${user.id}/deactivate`);
            } else {
                await api.put(`/admin/users/${user.id}/activate`);
            }

            setUsers((currentUsers) =>
                currentUsers.map((item) =>
                    item.id === user.id
                        ? { ...item, active: !item.active }
                        : item
                )
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to update user status."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return users.filter((user) => {
            const matchesRole =
                roleFilter === "ALL" ||
                user.role?.toUpperCase() === roleFilter;

            const matchesSearch =
                !searchText ||
                user.name?.toLowerCase().includes(searchText) ||
                user.email?.toLowerCase().includes(searchText) ||
                user.phone?.toLowerCase().includes(searchText);

            return matchesRole && matchesSearch;
        });
    }, [users, search, roleFilter]);

    const totalUsers = users.length;

    const studentCount = users.filter(
        (user) => user.role?.toUpperCase() === "STUDENT"
    ).length;

    const recruiterCount = users.filter(
        (user) => user.role?.toUpperCase() === "RECRUITER"
    ).length;

    const activeCount = users.filter((user) => user.active).length;

    const getRoleClass = (role) => {
        switch (role?.toUpperCase()) {
            case "STUDENT":
                return "role-student";

            case "RECRUITER":
                return "role-recruiter";

            case "ADMIN":
                return "role-admin";

            default:
                return "role-default";
        }
    };

    const formatRole = (role) => {
        if (!role) return "Unknown";

        return role
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    return (
        <div className="admin-users-page">

            {/* Header */}
            <div className="admin-users-header">
                <div>
                    <div className="admin-breadcrumb">
                        Admin <span>/</span> User Management
                    </div>

                    <h1>User Management</h1>

                    <p>
                        Manage students, recruiters, and platform users.
                    </p>
                </div>

                <button
                    className="refresh-users-btn"
                    onClick={fetchUsers}
                    disabled={loading}
                >
                    <span>↻</span>
                    Refresh
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="admin-users-error">
                    <span>⚠</span>
                    <span>{error}</span>

                    <button onClick={() => setError("")}>
                        ×
                    </button>
                </div>
            )}

            {/* Statistics */}
            <div className="user-stat-grid">

                <div className="user-stat-card">
                    <div className="user-stat-icon total">
                        👥
                    </div>

                    <div>
                        <span>Total Users</span>
                        <strong>{totalUsers}</strong>
                    </div>
                </div>

                <div className="user-stat-card">
                    <div className="user-stat-icon students">
                        🎓
                    </div>

                    <div>
                        <span>Students</span>
                        <strong>{studentCount}</strong>
                    </div>
                </div>

                <div className="user-stat-card">
                    <div className="user-stat-icon recruiters">
                        💼
                    </div>

                    <div>
                        <span>Recruiters</span>
                        <strong>{recruiterCount}</strong>
                    </div>
                </div>

                <div className="user-stat-card">
                    <div className="user-stat-icon active">
                        ✓
                    </div>

                    <div>
                        <span>Active Users</span>
                        <strong>{activeCount}</strong>
                    </div>
                </div>

            </div>

            {/* Main Card */}
            <div className="users-management-card">

                {/* Toolbar */}
                <div className="users-toolbar">

                    <div className="users-search">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                        {search && (
                            <button
                                className="clear-search"
                                onClick={() => setSearch("")}
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <div className="role-filters">

                        <button
                            className={
                                roleFilter === "ALL"
                                    ? "filter-btn active"
                                    : "filter-btn"
                            }
                            onClick={() => setRoleFilter("ALL")}
                        >
                            All
                        </button>

                        <button
                            className={
                                roleFilter === "STUDENT"
                                    ? "filter-btn active"
                                    : "filter-btn"
                            }
                            onClick={() => setRoleFilter("STUDENT")}
                        >
                            Students
                        </button>

                        <button
                            className={
                                roleFilter === "RECRUITER"
                                    ? "filter-btn active"
                                    : "filter-btn"
                            }
                            onClick={() => setRoleFilter("RECRUITER")}
                        >
                            Recruiters
                        </button>

                        <button
                            className={
                                roleFilter === "ADMIN"
                                    ? "filter-btn active"
                                    : "filter-btn"
                            }
                            onClick={() => setRoleFilter("ADMIN")}
                        >
                            Admins
                        </button>

                    </div>
                </div>

                {/* Result Count */}
                <div className="users-result-info">
                    Showing <strong>{filteredUsers.length}</strong> of{" "}
                    <strong>{totalUsers}</strong> users
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="users-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="users-empty">

                        <div className="empty-icon">
                            👥
                        </div>

                        <h3>No users found</h3>

                        <p>
                            Try changing your search or filter.
                        </p>

                    </div>
                ) : (
                    <div className="users-table-wrapper">

                        <table className="users-table">

                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        <td>
                                            <div className="user-info">

                                                <div className="user-avatar">
                                                    {user.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "U"}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {user.name || "Unnamed User"}
                                                    </strong>

                                                    <small>
                                                        ID #{user.id}
                                                    </small>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            <span className="user-email">
                                                {user.email || "—"}
                                            </span>
                                        </td>

                                        <td>
                                            {user.phone || "—"}
                                        </td>

                                        <td>
                                            <span
                                                className={`role-badge ${getRoleClass(
                                                    user.role
                                                )}`}
                                            >
                                                {formatRole(user.role)}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    user.active
                                                        ? "status-badge active"
                                                        : "status-badge inactive"
                                                }
                                            >
                                                <span className="status-dot"></span>
                                                {user.active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td>

                                            <button
                                                className={
                                                    user.active
                                                        ? "user-action-btn deactivate"
                                                        : "user-action-btn activate"
                                                }
                                                onClick={() =>
                                                    handleStatusChange(user)
                                                }
                                                disabled={
                                                    actionLoading === user.id
                                                }
                                            >
                                                {actionLoading === user.id
                                                    ? "Updating..."
                                                    : user.active
                                                        ? "Deactivate"
                                                        : "Activate"}
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
};

export default AdminUsers;