function Loading({ text = "Loading..." }) {

    return (
        <div className="loading-screen">

            <div className="loading-spinner" />

            <p>{text}</p>

        </div>
    );
}

export default Loading;