import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h2>Something went wrong</h2>
          <p style={styles.text}>
            {this.state.error?.message || 'An unexpected error occurred in the application.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={styles.btn}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '3rem',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '4rem auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  },
  text: {
    color: '#ef4444',
    margin: '1rem 0 1.5rem 0',
  },
  btn: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
