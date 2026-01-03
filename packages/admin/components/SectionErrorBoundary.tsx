import React from 'react';

type SectionErrorBoundaryProps = {
  title?: string;
  message?: string;
  children: React.ReactNode;
};

type SectionErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

export class SectionErrorBoundary extends React.Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  state: SectionErrorBoundaryState = {
    hasError: false,
    errorMessage: ''
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.setState({ errorMessage: String(error?.message || 'Unbekannter Fehler') });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="font-semibold">{this.props.title || 'Bereich konnte nicht geladen werden'}</div>
          <div className="mt-1 text-xs text-amber-700">
            {this.props.message || 'Bitte später erneut versuchen.'}
          </div>
          <details className="mt-2 text-xs text-amber-700">
            <summary className="cursor-pointer font-semibold">Details</summary>
            <pre className="mt-2 whitespace-pre-wrap">{this.state.errorMessage}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
