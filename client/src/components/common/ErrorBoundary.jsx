import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary - A component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-richblack-900 p-4">
          <div className="max-w-md w-full bg-richblack-800 rounded-xl p-6 border border-red-500/30">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-4">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-richblack-100 mb-2">
                Something went wrong
              </h2>
              <p className="text-richblack-300 mb-6">
                We're sorry, but an unexpected error occurred. Our team has been notified.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-richblack-900/50 p-3 rounded-lg mb-6 overflow-auto max-h-40">
                  <summary className="text-sm font-medium text-richblack-200 mb-2 cursor-pointer">
                    Error Details
                  </summary>
                  <p className="text-red-400 text-sm font-mono">
                    {this.state.error.toString()}
                  </p>
                  <pre className="text-xs text-richblack-400 mt-2 overflow-auto">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-yellow-400 text-richblack-900 rounded-md font-medium hover:bg-yellow-300 transition-colors"
                >
                  Try Again
                </button>
                <a
                  href="/"
                  className="px-4 py-2 bg-richblack-700 text-richblack-100 rounded-md font-medium hover:bg-richblack-600 transition-colors text-center"
                >
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
