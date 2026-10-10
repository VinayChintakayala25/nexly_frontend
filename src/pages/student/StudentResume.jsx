import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loading from "../../components/Loading";
import api from "../../services/api";
import "./StudentResume.css";

function StudentResume() {

    const fileInputRef = useRef(null);

    const [resumes, setResumes] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [openingId, setOpeningId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadResumes();
    }, []);

    // ==========================================
    // LOAD RESUMES
    // ==========================================

    const loadResumes = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/student/resumes"
                );

            setResumes(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Resume loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load your resumes."
            );

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // SELECT FILE
    // ==========================================

    const handleFileChange = (event) => {

        const file =
            event.target.files?.[0];

        setMessage("");
        setError("");

        if (!file) {
            setSelectedFile(null);
            return;
        }

        // Size check
        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Resume must be smaller than 5 MB."
            );

            event.target.value = "";
            setSelectedFile(null);

            return;
        }

        // Type check
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(
            file.type
        )) {

            setError(
                "Only PDF, DOC and DOCX files are allowed."
            );

            event.target.value = "";
            setSelectedFile(null);

            return;
        }

        setSelectedFile(file);
    };

    // ==========================================
    // UPLOAD
    // ==========================================

    const handleUpload = async (event) => {

        event.preventDefault();

        if (!selectedFile) {

            setError(
                "Please select a resume first."
            );

            return;
        }

        try {

            setUploading(true);
            setMessage("");
            setError("");

            const formData =
                new FormData();

            formData.append(
                "file",
                selectedFile
            );

            const response =
                await api.post(
                    "/student/resumes/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );

            setResumes(
                (previous) => [
                    response.data,
                    ...previous
                ]
            );

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setMessage(
                "Resume uploaded successfully!"
            );

        } catch (err) {

            console.error(
                "Resume upload error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to upload resume."
            );

        } finally {

            setUploading(false);
        }
    };

    // ==========================================
    // VIEW / DOWNLOAD
    // ==========================================

    const handleOpenResume = async (resume) => {

        try {

            setOpeningId(resume.id);
            setError("");

            const response =
                await api.get(
                    `/student/resumes/${resume.id}/download`,
                    {
                        responseType: "blob"
                    }
                );

            const blob =
                new Blob(
                    [response.data],
                    {
                        type:
                            response.headers[
                                "content-type"
                            ] || resume.fileType
                    }
                );

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const newWindow =
                window.open(
                    url,
                    "_blank"
                );

            if (!newWindow) {

                const link =
                    document.createElement(
                        "a"
                    );

                link.href = url;
                link.download =
                    resume.fileName;

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();
            }

            setTimeout(() => {
                window.URL.revokeObjectURL(
                    url
                );
            }, 10000);

        } catch (err) {

            console.error(
                "Resume open error:",
                err
            );

            setError(
                "Unable to open the resume."
            );

        } finally {

            setOpeningId(null);
        }
    };

    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this resume?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(id);
            setError("");
            setMessage("");

            await api.delete(
                `/student/resumes/${id}`
            );

            setResumes(
                (previous) =>
                    previous.filter(
                        (resume) =>
                            resume.id !== id
                    )
            );

            setMessage(
                "Resume deleted successfully."
            );

        } catch (err) {

            console.error(
                "Resume delete error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to delete resume."
            );

        } finally {

            setDeletingId(null);
        }
    };

    // ==========================================
    // HELPERS
    // ==========================================

    const getFileIcon = (fileType) => {

        if (
            fileType ===
            "application/pdf"
        ) {
            return "📕";
        }

        if (
            fileType ===
            "application/msword"
        ) {
            return "📘";
        }

        return "📄";
    };

    const formatDate = (date) => {

        if (!date) {
            return "Recently";
        }

        return new Date(date)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );
    };

    const formatFileSize = (file) => {

        if (!file) {
            return "";
        }

        const size =
            file.size / 1024 / 1024;

        return `${size.toFixed(2)} MB`;
    };

    if (loading) {

        return (
            <DashboardLayout>
                <Loading
                    text="Loading your resumes..."
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="resume-page">

                {/* HEADER */}

                <div className="resume-page-header">

                    <div>

                        <span className="resume-eyebrow">
                            MY RESUME
                        </span>

                        <h1>
                            Manage your resume
                        </h1>

                        <p>
                            Upload your latest resume so
                            recruiters can understand your
                            experience and qualifications.
                        </p>

                    </div>

                    <div className="resume-header-icon">
                        📄
                    </div>

                </div>

                {/* ALERTS */}

                {message && (
                    <div className="resume-alert success">
                        <span>✓</span>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="resume-alert error">
                        <span>!</span>
                        {error}
                    </div>
                )}

                {/* MAIN GRID */}

                <div className="resume-main-grid">

                    {/* UPLOAD CARD */}

                    <div className="resume-card upload-resume-card">

                        <div className="resume-card-heading">

                            <div className="resume-section-icon">
                                ↑
                            </div>

                            <div>

                                <h2>
                                    Upload Resume
                                </h2>

                                <p>
                                    Keep your latest resume
                                    available for opportunities.
                                </p>

                            </div>

                        </div>

                        <form
                            onSubmit={handleUpload}
                            className="resume-upload-form"
                        >

                            <div
                                className="resume-drop-zone"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                            >

                                <div className="resume-upload-icon">
                                    📤
                                </div>

                                <h3>
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Choose your resume"}
                                </h3>

                                <p>
                                    {selectedFile
                                        ? formatFileSize(
                                            selectedFile
                                        )
                                        : "Click here to select a file"}
                                </p>

                                <span>
                                    PDF, DOC or DOCX • Max 5 MB
                                </span>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    hidden
                                />

                            </div>

                            {selectedFile && (
                                <div className="selected-file">

                                    <div className="selected-file-icon">
                                        {getFileIcon(
                                            selectedFile.type
                                        )}
                                    </div>

                                    <div>
                                        <strong>
                                            {selectedFile.name}
                                        </strong>

                                        <span>
                                            {formatFileSize(
                                                selectedFile
                                            )}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setSelectedFile(
                                                null
                                            );

                                            if (
                                                fileInputRef.current
                                            ) {
                                                fileInputRef.current.value =
                                                    "";
                                            }

                                        }}
                                    >
                                        ×
                                    </button>

                                </div>
                            )}

                            <button
                                type="submit"
                                className="resume-upload-button"
                                disabled={
                                    uploading ||
                                    !selectedFile
                                }
                            >

                                {uploading ? (
                                    <>
                                        <span className="resume-spinner" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        Upload Resume →
                                    </>
                                )}

                            </button>

                        </form>

                        <div className="resume-tip">

                            <span>💡</span>

                            <p>
                                Keep your resume updated with
                                your latest projects, skills,
                                certifications and achievements.
                            </p>

                        </div>

                    </div>

                    {/* RESUME LIST */}

                    <div className="resume-card resume-list-card">

                        <div className="resume-list-header">

                            <div>

                                <span className="resume-small-label">
                                    YOUR DOCUMENTS
                                </span>

                                <h2>
                                    Uploaded Resumes
                                </h2>

                            </div>

                            <div className="resume-count">
                                {resumes.length}
                            </div>

                        </div>

                        {resumes.length > 0 ? (

                            <div className="resume-list">

                                {resumes.map(
                                    (resume, index) => (

                                        <div
                                            className={`resume-item ${
                                                index === 0
                                                    ? "latest"
                                                    : ""
                                            }`}
                                            key={resume.id}
                                        >

                                            <div className="resume-file-icon">
                                                {getFileIcon(
                                                    resume.fileType
                                                )}
                                            </div>

                                            <div className="resume-file-info">

                                                <div className="resume-name-row">

                                                    <strong>
                                                        {resume.fileName}
                                                    </strong>

                                                    {index === 0 && (
                                                        <span className="latest-badge">
                                                            Latest
                                                        </span>
                                                    )}

                                                </div>

                                                <span>
                                                    Uploaded{" "}
                                                    {formatDate(
                                                        resume.uploadedAt
                                                    )}
                                                </span>

                                            </div>

                                            <div className="resume-actions">

                                                <button
                                                    type="button"
                                                    className="resume-view-button"
                                                    onClick={() =>
                                                        handleOpenResume(
                                                            resume
                                                        )
                                                    }
                                                    disabled={
                                                        openingId ===
                                                        resume.id
                                                    }
                                                >

                                                    {openingId ===
                                                    resume.id ? (
                                                        <span className="small-spinner" />
                                                    ) : (
                                                        "View"
                                                    )}

                                                </button>

                                                <button
                                                    type="button"
                                                    className="resume-delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            resume.id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        resume.id
                                                    }
                                                >

                                                    {deletingId ===
                                                    resume.id ? (
                                                        <span className="small-spinner" />
                                                    ) : (
                                                        "Delete"
                                                    )}

                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="resume-empty-state">

                                <div>
                                    📄
                                </div>

                                <h3>
                                    No resume uploaded yet
                                </h3>

                                <p>
                                    Upload your resume to make
                                    your profile more complete
                                    and ready for recruiters.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

                {/* RESUME GUIDELINES */}

                <div className="resume-guidelines">

                    <div className="guideline-icon">
                        ✦
                    </div>

                    <div>

                        <span>
                            NEXLY RESUME TIP
                        </span>

                        <h2>
                            Keep your resume clear and updated.
                        </h2>

                        <p>
                            Highlight your strongest projects,
                            technical skills, certifications and
                            achievements. A current resume helps
                            recruiters understand your profile faster.
                        </p>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default StudentResume;