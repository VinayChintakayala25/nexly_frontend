import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loading from "../../components/Loading";
import api from "../../services/api";
import "./StudentSkills.css";

function StudentSkills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [skillName, setSkillName] = useState("");
    const [level, setLevel] = useState("Beginner");

    const [search, setSearch] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/student/skills"
            );

            setSkills(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error(
                "Skills loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load your skills."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();

        const trimmedSkill =
            skillName.trim();

        if (!trimmedSkill) {
            setError("Please enter a skill name.");
            setMessage("");
            return;
        }

        const alreadyExists = skills.some(
            (studentSkill) =>
                studentSkill.skill?.name?.toLowerCase() ===
                trimmedSkill.toLowerCase()
        );

        if (alreadyExists) {
            setError(
                "You have already added this skill."
            );
            setMessage("");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const response = await api.post(
                "/student/skills",
                {
                    skillName: trimmedSkill,
                    level: level
                }
            );

            setSkills((previous) => [
                ...previous,
                response.data
            ]);

            setSkillName("");
            setLevel("Beginner");

            setMessage(
                `${trimmedSkill} added successfully!`
            );

        } catch (err) {
            console.error(
                "Skill add error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to add skill."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSkill = async (id) => {
        try {
            setDeletingId(id);
            setError("");
            setMessage("");

            await api.delete(
                `/student/skills/${id}`
            );

            setSkills((previous) =>
                previous.filter(
                    (skill) => skill.id !== id
                )
            );

            setMessage(
                "Skill removed successfully."
            );

        } catch (err) {
            console.error(
                "Skill delete error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to delete skill."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filteredSkills = useMemo(() => {
        const searchText =
            search.trim().toLowerCase();

        if (!searchText) {
            return skills;
        }

        return skills.filter(
            (studentSkill) =>
                studentSkill.skill?.name
                    ?.toLowerCase()
                    .includes(searchText)
        );
    }, [skills, search]);

    const levelCount = {
        Beginner: skills.filter(
            (item) =>
                item.level === "Beginner"
        ).length,

        Intermediate: skills.filter(
            (item) =>
                item.level === "Intermediate"
        ).length,

        Advanced: skills.filter(
            (item) =>
                item.level === "Advanced"
        ).length
    };

    const getLevelClass = (skillLevel) => {
        switch (
            skillLevel?.toLowerCase()
        ) {
            case "advanced":
                return "advanced";

            case "intermediate":
                return "intermediate";

            default:
                return "beginner";
        }
    };

    const getSkillIcon = (name = "") => {
        const skill =
            name.toLowerCase();

        if (
            skill.includes("java") ||
            skill.includes("python") ||
            skill.includes("javascript") ||
            skill.includes("c++") ||
            skill.includes("c#")
        ) {
            return "💻";
        }

        if (
            skill.includes("react") ||
            skill.includes("angular") ||
            skill.includes("html") ||
            skill.includes("css")
        ) {
            return "🌐";
        }

        if (
            skill.includes("sql") ||
            skill.includes("mysql") ||
            skill.includes("mongodb") ||
            skill.includes("database")
        ) {
            return "🗄️";
        }

        if (
            skill.includes("spring") ||
            skill.includes("node") ||
            skill.includes("express")
        ) {
            return "⚙️";
        }

        if (
            skill.includes("git") ||
            skill.includes("github")
        ) {
            return "🔀";
        }

        if (
            skill.includes("aws") ||
            skill.includes("azure") ||
            skill.includes("cloud")
        ) {
            return "☁️";
        }

        if (
            skill.includes("machine") ||
            skill.includes("ai") ||
            skill.includes("data")
        ) {
            return "🤖";
        }

        return "✦";
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loading
                    text="Loading your skills..."
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="skills-page">

                {/* PAGE HEADER */}
                <div className="skills-page-header">

                    <div>
                        <span className="skills-eyebrow">
                            MY SKILLS
                        </span>

                        <h1>
                            Build your skill profile
                        </h1>

                        <p>
                            Add your technical and professional
                            skills so Nexly can connect you with
                            relevant opportunities.
                        </p>
                    </div>

                    <div className="skills-header-icon">
                        🧠
                    </div>

                </div>

                {/* ALERTS */}
                {message && (
                    <div className="skills-alert success">
                        <span>✓</span>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="skills-alert error">
                        <span>!</span>
                        {error}
                    </div>
                )}

                {/* SUMMARY */}
                <div className="skills-summary-grid">

                    <div className="skill-summary-card total">

                        <div className="summary-icon">
                            ✦
                        </div>

                        <div>
                            <strong>
                                {skills.length}
                            </strong>

                            <span>
                                Total Skills
                            </span>
                        </div>

                    </div>

                    <div className="skill-summary-card beginner">

                        <div className="summary-icon">
                            🌱
                        </div>

                        <div>
                            <strong>
                                {levelCount.Beginner}
                            </strong>

                            <span>
                                Beginner
                            </span>
                        </div>

                    </div>

                    <div className="skill-summary-card intermediate">

                        <div className="summary-icon">
                            📈
                        </div>

                        <div>
                            <strong>
                                {levelCount.Intermediate}
                            </strong>

                            <span>
                                Intermediate
                            </span>
                        </div>

                    </div>

                    <div className="skill-summary-card advanced">

                        <div className="summary-icon">
                            🚀
                        </div>

                        <div>
                            <strong>
                                {levelCount.Advanced}
                            </strong>

                            <span>
                                Advanced
                            </span>
                        </div>

                    </div>

                </div>

                {/* MAIN GRID */}
                <div className="skills-main-grid">

                    {/* ADD SKILL */}
                    <div className="skills-card add-skill-card">

                        <div className="skills-card-heading">

                            <div className="skills-section-icon">
                                +
                            </div>

                            <div>
                                <h2>
                                    Add a Skill
                                </h2>

                                <p>
                                    Tell recruiters what you can do.
                                </p>
                            </div>

                        </div>

                        <form
                            onSubmit={handleAddSkill}
                            className="skill-form"
                        >

                            <div className="skill-form-field">

                                <label>
                                    Skill Name
                                </label>

                                <input
                                    type="text"
                                    value={skillName}
                                    onChange={(e) =>
                                        setSkillName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Java, React, SQL"
                                />

                            </div>

                            <div className="skill-form-field">

                                <label>
                                    Skill Level
                                </label>

                                <select
                                    value={level}
                                    onChange={(e) =>
                                        setLevel(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="Beginner">
                                        Beginner
                                    </option>

                                    <option value="Intermediate">
                                        Intermediate
                                    </option>

                                    <option value="Advanced">
                                        Advanced
                                    </option>
                                </select>

                            </div>

                            <button
                                type="submit"
                                className="add-skill-button"
                                disabled={saving}
                            >

                                {saving ? (
                                    <>
                                        <span className="skill-button-spinner" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <span>+</span>
                                        Add Skill
                                    </>
                                )}

                            </button>

                        </form>

                        <div className="skill-tip">
                            <span>💡</span>

                            <p>
                                Add skills you genuinely know.
                                Keeping your profile accurate helps
                                Nexly recommend better opportunities.
                            </p>
                        </div>

                    </div>

                    {/* SKILLS LIST */}
                    <div className="skills-card skills-list-card">

                        <div className="skills-list-header">

                            <div>
                                <span className="skills-small-label">
                                    YOUR SKILLS
                                </span>

                                <h2>
                                    Skill Collection
                                </h2>
                            </div>

                            <div className="skill-count">
                                {skills.length}
                            </div>

                        </div>

                        {/* SEARCH */}
                        <div className="skills-search">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search your skills..."
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    ×
                                </button>
                            )}

                        </div>

                        {/* SKILL CARDS */}
                        {filteredSkills.length > 0 ? (

                            <div className="skills-list">

                                {filteredSkills.map(
                                    (studentSkill) => {

                                        const skillName =
                                            studentSkill
                                                .skill
                                                ?.name ||
                                            "Unknown Skill";

                                        return (
                                            <div
                                                className="student-skill-item"
                                                key={
                                                    studentSkill.id
                                                }
                                            >

                                                <div className="student-skill-icon">
                                                    {getSkillIcon(
                                                        skillName
                                                    )}
                                                </div>

                                                <div className="student-skill-info">

                                                    <strong>
                                                        {skillName}
                                                    </strong>

                                                    <span
                                                        className={`skill-level-badge ${getLevelClass(
                                                            studentSkill.level
                                                        )}`}
                                                    >
                                                        {studentSkill.level ||
                                                            "Beginner"}
                                                    </span>

                                                </div>

                                                <button
                                                    type="button"
                                                    className="delete-skill-button"
                                                    onClick={() =>
                                                        handleDeleteSkill(
                                                            studentSkill.id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        studentSkill.id
                                                    }
                                                    title="Remove skill"
                                                >

                                                    {deletingId ===
                                                    studentSkill.id ? (
                                                        <span className="delete-spinner" />
                                                    ) : (
                                                        "×"
                                                    )}

                                                </button>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        ) : skills.length === 0 ? (

                            <div className="skills-empty-state">

                                <div className="empty-skill-icon">
                                    🧠
                                </div>

                                <h3>
                                    No skills added yet
                                </h3>

                                <p>
                                    Add your first skill using the
                                    form and start building your
                                    professional profile.
                                </p>

                            </div>

                        ) : (

                            <div className="skills-empty-state">

                                <div className="empty-skill-icon">
                                    🔍
                                </div>

                                <h3>
                                    No matching skills
                                </h3>

                                <p>
                                    Try a different search term.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

                {/* CAREER TIP */}
                <div className="skills-career-card">

                    <div className="career-tip-icon">
                        🚀
                    </div>

                    <div className="career-tip-content">

                        <span>
                            NEXLY CAREER TIP
                        </span>

                        <h2>
                            Strong profiles get better matches.
                        </h2>

                        <p>
                            Add a mix of programming languages,
                            frameworks, databases and professional
                            skills. This helps Nexly understand
                            the type of opportunities that fit you.
                        </p>

                    </div>

                    <div className="career-tip-decoration">
                        ✦
                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default StudentSkills;