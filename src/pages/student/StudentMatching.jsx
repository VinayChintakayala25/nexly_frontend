import { useEffect, useState } from "react";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "./StudentMatching.css";

function StudentMatching() {

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadMatches();
    }, []);


    const loadMatches = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/student/matching");

            setMatches(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load opportunity matches."
            );

        } finally {

            setLoading(false);
        }
    };


    const getMatchClass = (percentage) => {

        if (percentage >= 80) {
            return "excellent";
        }

        if (percentage >= 60) {
            return "good";
        }

        if (percentage >= 40) {
            return "medium";
        }

        return "low";
    };


    return (
        <div className="student-matching-page">

            <div className="matching-header">

                <div>

                    <span className="matching-eyebrow">
                        NEXLY INTELLIGENCE
                    </span>

                    <h1>
                        Match & Skill Gap
                    </h1>

                    <p>
                        Discover how well your skills match
                        available opportunities and identify
                        the skills you can improve.
                    </p>

                </div>

                <div className="matching-header-icon">
                    ✦
                </div>

            </div>


            {error && (

                <div className="matching-error">

                    <span>⚠</span>

                    <span>{error}</span>

                    <button onClick={loadMatches}>
                        Try Again
                    </button>

                </div>

            )}


            {loading ? (

                <div className="matching-loading">
                    <Loading />
                </div>

            ) : matches.length === 0 ? (

                <div className="matching-empty">

                    <div className="matching-empty-icon">
                        ✦
                    </div>

                    <h2>
                        No matches available yet
                    </h2>

                    <p>
                        Add your skills and wait for
                        opportunities to be published.
                        Nexly will calculate your match
                        automatically.
                    </p>

                </div>

            ) : (

                <div className="matching-list">

                    {matches.map((match) => {

                        const percentage =
                            Number(
                                match.matchPercentage || 0
                            );

                        const matchClass =
                            getMatchClass(
                                percentage
                            );

                        return (

                            <article
                                key={
                                    match.opportunityId
                                }
                                className="matching-card"
                            >

                                <div className="matching-card-main">

                                    <div className="matching-opportunity-icon">
                                        N
                                    </div>

                                    <div className="matching-opportunity-info">

                                        <h2>
                                            {
                                                match.opportunityTitle ||
                                                "Opportunity"
                                            }
                                        </h2>

                                        <p>
                                            Opportunity #
                                            {
                                                match.opportunityId
                                            }
                                        </p>

                                    </div>

                                </div>


                                <div className="matching-score">

                                    <div
                                        className={`match-circle ${matchClass}`}
                                    >
                                        <strong>
                                            {
                                                percentage
                                            }%
                                        </strong>

                                        <span>
                                            Match
                                        </span>
                                    </div>

                                </div>


                                <div className="matching-progress">

                                    <div className="progress-header">

                                        <span>
                                            Skill compatibility
                                        </span>

                                        <strong>
                                            {
                                                percentage
                                            }%
                                        </strong>

                                    </div>

                                    <div className="progress-track">

                                        <div
                                            className={`progress-fill ${matchClass}`}
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        percentage,
                                                        100
                                                    )}%`
                                            }}
                                        />

                                    </div>

                                </div>


                                <div className="matching-skills-section">

                                    <div className="skills-column">

                                        <h3>
                                            ✓ Matching Skills
                                        </h3>

                                        {match.matchingSkills &&
                                        match.matchingSkills.length > 0 ? (

                                            <div className="skill-list">

                                                {match.matchingSkills.map(
                                                    (skill, index) => (

                                                        <span
                                                            key={index}
                                                            className="skill-chip matched"
                                                        >
                                                            ✓ {skill}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        ) : (

                                            <p className="no-skills">
                                                No matching skills yet.
                                            </p>

                                        )}

                                    </div>


                                    <div className="skills-column">

                                        <h3>
                                            + Skills to Improve
                                        </h3>

                                        {match.missingSkills &&
                                        match.missingSkills.length > 0 ? (

                                            <div className="skill-list">

                                                {match.missingSkills.map(
                                                    (skill, index) => (

                                                        <span
                                                            key={index}
                                                            className="skill-chip missing"
                                                        >
                                                            + {skill}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        ) : (

                                            <p className="no-skills">
                                                You have all required
                                                skills.
                                            </p>

                                        )}

                                    </div>

                                </div>

                            </article>

                        );

                    })}

                </div>

            )}

        </div>
    );
}

export default StudentMatching;