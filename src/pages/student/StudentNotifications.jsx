import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "./StudentNotifications.css";

function StudentNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [markingAll, setMarkingAll] = useState(false);
    const [markingId, setMarkingId] = useState(null);

    useEffect(() => {
        loadNotifications();
    }, []);

    /*
     * REAL-TIME WEBSOCKET
     */
    useEffect(() => {
        const storedUser = localStorage.getItem("nexly_user");

        if (!storedUser) {
            return;
        }

        let user;

        try {
            user = JSON.parse(storedUser);
        } catch (err) {
            console.error(
                "Unable to read stored user:",
                err
            );
            return;
        }

        if (!user?.id) {
            return;
        }

        const client = new Client({
            brokerURL: "ws://localhost:8080/api/ws",

            reconnectDelay: 5000,

            onConnect: () => {
                console.log(
                    "Nexly WebSocket connected"
                );

                client.subscribe(
                    `/topic/user/${user.id}`,
                    (message) => {
                        try {
                            const newNotification =
                                JSON.parse(
                                    message.body
                                );

                            setNotifications(
                                (current) => {

                                    const exists =
                                        current.some(
                                            (notification) =>
                                                notification.id ===
                                                newNotification.id
                                        );

                                    if (exists) {
                                        return current;
                                    }

                                    return [
                                        newNotification,
                                        ...current,
                                    ];
                                }
                            );
                        } catch (err) {
                            console.error(
                                "Notification parsing error:",
                                err
                            );
                        }
                    }
                );
            },

            onStompError: (frame) => {
                console.error(
                    "WebSocket STOMP error:",
                    frame
                );
            },

            onWebSocketError: (error) => {
                console.error(
                    "WebSocket error:",
                    error
                );
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/notifications");

            setNotifications(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            setMarkingId(id);

            await api.put(
                `/notifications/${id}/read`
            );

            setNotifications((current) =>
                current.map((notification) =>
                    notification.id === id
                        ? {
                              ...notification,
                              read: true,
                          }
                        : notification
                )
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to mark notification as read."
            );
        } finally {
            setMarkingId(null);
        }
    };

    const markAllAsRead = async () => {
        try {
            setMarkingAll(true);
            setError("");

            await api.put(
                "/notifications/read-all"
            );

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    read: true,
                }))
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to mark notifications as read."
            );
        } finally {
            setMarkingAll(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const unreadCount =
        notifications.filter(
            (notification) =>
                notification.read !== true
        ).length;

    return (
        <div className="student-notifications-page">

            {/* HEADER */}

            <div className="notifications-header">

                <div>
                    <span className="notifications-eyebrow">
                        STAY UPDATED
                    </span>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Keep track of important updates
                        about your Nexly activity.
                    </p>
                </div>

                <div className="notifications-header-actions">

                    <div className="notifications-count">

                        <strong>
                            {unreadCount}
                        </strong>

                        <span>
                            Unread
                        </span>

                    </div>

                    {unreadCount > 0 && (
                        <button
                            className="mark-all-button"
                            onClick={markAllAsRead}
                            disabled={markingAll}
                        >
                            {markingAll
                                ? "Updating..."
                                : "Mark all as read"}
                        </button>
                    )}

                </div>

            </div>


            {/* ERROR */}

            {error && (
                <div className="notifications-error">

                    <span>
                        ⚠
                    </span>

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={loadNotifications}
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* CONTENT */}

            {loading ? (

                <div className="notifications-loading">
                    <Loading />
                </div>

            ) : notifications.length === 0 ? (

                <div className="notifications-empty">

                    <div className="notifications-empty-icon">
                        🔔
                    </div>

                    <h2>
                        No notifications yet
                    </h2>

                    <p>
                        When there are updates about your
                        applications, interviews or
                        opportunities, they will appear here.
                    </p>

                </div>

            ) : (

                <div className="notifications-list">

                    {notifications.map(
                        (notification) => (

                            <div
                                key={notification.id}
                                className={`notification-card ${
                                    notification.read
                                        ? "read"
                                        : "unread"
                                }`}
                            >

                                <div className="notification-icon">
                                    {notification.read
                                        ? "✓"
                                        : "🔔"}
                                </div>

                                <div className="notification-content">

                                    <div className="notification-top">

                                        <h3>
                                            {notification.title ||
                                                "Notification"}
                                        </h3>

                                        {!notification.read && (
                                            <span className="unread-dot">
                                                New
                                            </span>
                                        )}

                                    </div>

                                    <p>
                                        {notification.message ||
                                            "You have a new notification."}
                                    </p>

                                    <span className="notification-date">
                                        {formatDate(
                                            notification.createdAt
                                        )}
                                    </span>

                                </div>

                                {!notification.read && (
                                    <button
                                        className="mark-read-button"
                                        disabled={
                                            markingId ===
                                            notification.id
                                        }
                                        onClick={() =>
                                            markAsRead(
                                                notification.id
                                            )
                                        }
                                    >
                                        {markingId ===
                                        notification.id
                                            ? "..."
                                            : "Mark read"}
                                    </button>
                                )}

                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}

export default StudentNotifications;