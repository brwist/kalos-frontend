import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | undefined;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(err: Error): State {
    return { hasError: true, error: err };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('An uncaught error occurred:', error, errorInfo);
  }

  public render() {
    //console.log('Rendering an error boundary');

    if (this.state.hasError) {
      return (
        <>
          <h1 style={{ textAlign: 'center' }}>Whoops! We had an error.</h1>
          <h2 style={{ textAlign: 'center' }}>
            Please report this to the webtech team in{' '}
            <a href="https://kalos-services.slack.com/archives/C0NDWN8TT">
              #webtech
            </a>{' '}
            on Slack.
          </h2>
          <h2>
            Error:{' '}
            {this.state.error !== undefined
              ? `${this.state.error.message} (${this.state.error.name})`
              : ''}
          </h2>
          <h4>Please include this stacktrace in a screenshot: </h4>
          <h4 style={{ color: 'red' }}>
            {this.state.error !== undefined ? this.state.error.stack : ''}
          </h4>
        </>
      );
    }

    return this.props.children;
  }
}
