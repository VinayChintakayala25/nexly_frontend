import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "./StudentSaved.css";

function StudentSaved() {
    const navigate = useNavigate();

    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadSavedOpportunities();
    }, []);

    const loadSavedOpportunities = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/student/saved");

            setSavedItems(response.data || []);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load saved opportunities."
            );
        } finally {
            setLoading(false);
        }
    };

    const removeSaved = async (opportunityId) => {
        try {
            setRemovingId(opportunityId);

            await api.delete(
                `/student/saved/${opportunityId}`
            );

            setSavedItems((current) =>
                current.filter(
                    (item) =>
                        item.opportunity?.id !==
                        opportunityId
                )
            );

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to remove saved opportunity."
            );
        } finally {
            setRemovingId(null);
        }
    };

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

    const filteredItems = savedItems.filter(
        (item) => {

            const opportunity =
                item.opportunity || {};

            const searchText =
                search.trim().toLowerCase();

            if (!searchText) {
                return true;
            }

            const title =
                opportunity.title || "";

            const location =
                opportunity.location || "";

            const type =
                opportunity.type || "";

            const companyName =
                opportunity.company?.companyName ||
                "";

            return (
                title
                    .toLowerCase()
                    .includes(searchText) ||
                location
                    .toLowerCase()
                    .includes(searchText) ||
                type
                    .toLowerCase()
                    .includes(searchText) ||
                companyName
                    .toLowerCase()
                    .includes(searchText)
            );
        }
    );

    return (
        <div className="student-saved-page">

            {/* HEADER */}

            <div className="saved-page-header">

                <div>
                    <span className="saved-eyebrow">
                        YOUR COLLECTION
                    </span>

                    <h1>
                        Saved Opportunities
                    </h1>

                    <p>
                        Keep track of opportunities you
                        want to explore later.
                    </p>
                </div>

                <div className="saved-count">
                    <strong>
                        {savedItems.length}
                    </strong>

                    <span>
                        Saved
                    </span>
                </div>

            </div>


            {/* ERROR */}

            {error && (
                <div className="saved-error">
                    ⚠ {error}

                    <button
                        onClick={
                            loadSavedOpportunities
                        }
                    >
                        Try Again
                    </button>
                </div>
            )}


            {/* SEARCH */}

            {!loading &&
                savedItems.length > 0 && (
                    <div className="saved-search-card">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search your saved opportunities..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>
                )}


            {/* CONTENT */}

            {loading ? (

                <div className="saved-loading">
                    <Loading />
                </div>

            ) : filteredItems.length === 0 ? (

                <div className="saved-empty">

                    <div className="saved-empty-icon">
                        ♡
                    </div>

                    <h2>
                        {savedItems.length === 0
                            ? "No saved opportunities"
                            : "No matching opportunities"}
                    </h2>

                    <p>
                        {savedItems.length === 0
                            ? "Save interesting jobs, internships or projects so you can come back to them later."
                            : "Try changing your search."}
                    </p>

                    {savedItems.length === 0 && (
                        <button
                            onClick={() =>
                                navigate(
                                    "/student/opportunities"
                                )
                            }
                        >
                            Discover Opportunities
                        </button>
                    )}

                </div>

            ) : (

                <div className="saved-grid">

                    {filteredItems.map(
                        (item) => {

                            const opportunity =
                                item.opportunity ||
                                {};

                            const companyName =
                                opportunity.company
                                    ?.companyName ||
                                "Company";

                            const opportunityId =
                                opportunity.id;

                            return (
                                <article
                                    className="saved-card"
                                    key={item.id}
                                >

                                    <div className="saved-card-top">

                                        <div className="saved-company-logo">
                                            {companyName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <button
                                            className="remove-saved-button"
                                            disabled={
                                                removingId ===
                                                opportunityId
                                            }
                                            onClick={() =>
                                                removeSaved(
                                                    opportunityId
                                                )
                                            }
                                            title="Remove from saved"
                                        >
                                            {removingId ===
                                            opportunityId
                                                ? "..."
                                                : "♥"}
                                        </button>

                                    </div>


                                    <span className="saved-type">
                                        {opportunity.type ||
                                            "Opportunity"}
                                    </span>


                                    <h2>
                                        {opportunity.title ||
                                            "Untitled Opportunity"}
                                    </h2>


                                    <p className="saved-company">
                                        {companyName}
                                    </p>


                                    <div className="saved-meta">

                                        {opportunity.location && (
                                            <span>
                                                📍{" "}
                                                {
                                                    opportunity.location
                                                }
                                            </span>
                                        )}

                                        {opportunity.workMode && (
                                            <span>
                                                💼{" "}
                                                {
                                                    opportunity.workMode
                                                }
                                            </span>
                                        )}

                                    </div>


                                    <div className="saved-deadline">

                                        <span>
                                            Deadline
                                        </span>

                                        <strong>
                                            {formatDate(
                                                opportunity.applicationDeadline
                                            )}
                                        </strong>

                                    </div>


                                    <button
                                        className="view-saved-button"
                                        onClick={() =>
                                            navigate(
                                                `/student/opportunities/${opportunityId}`
                                            )
                                        }
                                    >
                                        View Opportunity →
                                    </button>

                                </article>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
}

export default StudentSaved;