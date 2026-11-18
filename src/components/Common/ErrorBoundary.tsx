import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#04060d',
            color: '#f8fafc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              backgroundColor: '#0b1120',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '32px 24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#38bdf8',
                letterSpacing: '0.1em',
                marginBottom: '12px'
              }}
            >
              KAYLA UNIVERSE - RUNTIME RECOVERY
            </div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '16px'
              }}
            >
              Temporary Display Recovery
            </h1>
            <p
              style={{
                fontSize: '0.95rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                marginBottom: '24px'
              }}
            >
              A client runtime exception occurred during rendering. The application state has been preserved. You can refresh the portfolio or clear the cache.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}
            >
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#38bdf8',
                  color: '#04060d',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Reload Portfolio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
