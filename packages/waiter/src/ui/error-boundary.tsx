import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  errorType: string;
  errorMessage: string;
  errorStack: string;
  componentStack: string;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorType: "client",
    errorMessage: "",
    errorStack: "",
    componentStack: ""
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const message = String(error?.message || "Unbekannter Fehler");
    const stack = String(error?.stack || "");
    const componentStack = String(info?.componentStack || "");
    const errorType = classifyError(message);
    this.setState({
      errorType,
      errorMessage: message,
      errorStack: stack,
      componentStack
    });
  }

  handleReset = () => {
    if (window.confirm("App wirklich zurücksetzen?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const { errorType, errorMessage, errorStack, componentStack } = this.state;
      const copy = `${errorMessage}${errorStack ? `\n\n${errorStack}` : ""}${componentStack ? `\n\n${componentStack}` : ""}`;
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center">
            <h1 className="text-lg font-bold text-slate-800 mb-2">{getTitle(errorType)}</h1>
            <p className="text-sm text-slate-500 mb-5">{getMessage(errorType)}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-contrast"
              >
                Neu laden
              </button>
              <button
                onClick={this.handleReset}
                className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                App zurücksetzen
              </button>
            </div>
            <details className="mt-4 text-left text-xs text-slate-500">
              <summary className="cursor-pointer font-semibold text-slate-600">Details</summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600">
                {copy}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function classifyError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("network") || lower.includes("failed to fetch") || lower.includes("load failed")) {
    return "network";
  }
  if (lower.includes("auth.") || lower.includes("unauthorized") || lower.includes("401")) {
    return "auth";
  }
  if (lower.includes("400") || lower.includes("bad request") || lower.includes("validation")) {
    return "bad_input";
  }
  if (lower.includes("500") || lower.includes("server") || lower.includes("sql")) {
    return "server";
  }
  return "client";
}

function getTitle(type: string) {
  switch (type) {
    case "network":
      return "Netzwerkfehler";
    case "auth":
      return "Anmeldung erforderlich";
    case "bad_input":
      return "Ungültige Eingabe";
    case "server":
      return "Serverfehler";
    default:
      return "App reagiert nicht?";
  }
}

function getMessage(type: string) {
  switch (type) {
    case "network":
      return "Bitte Verbindung prüfen und erneut versuchen.";
    case "auth":
      return "Bitte neu anmelden.";
    case "bad_input":
      return "Bitte Eingaben prüfen oder zurückgehen.";
    case "server":
      return "Der Server hat ein Problem. Bitte später erneut versuchen.";
    default:
      return "Als letzten Schritt können Sie die App zurücksetzen.";
  }
}
