import React, { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught an error:", error, info);
        // Optionally, log error to an external service
        // logErrorToService(error, info);
    }

    handleRetry = () => {
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <h2>Oops! Something went wrong.</h2>
                    <p>Try refreshing the page or click below to retry.</p>
                    <button onClick={this.handleRetry} style={{ padding: "10px", cursor: "pointer" }}>
                        Retry
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
