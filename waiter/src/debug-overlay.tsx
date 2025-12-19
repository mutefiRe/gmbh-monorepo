import React, { useEffect, useState, useRef } from "react";

export function DebugOverlay() {
  const [messages, setMessages] = useState<string[]>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const push = (msg: string) => {
      setMessages(prev => [...prev, msg]);
      if (overlayRef.current) {
        overlayRef.current.scrollTop = overlayRef.current.scrollHeight;
      }
    };

    // --- ERROR HANDLERS ---
    const onError = (event: ErrorEvent) => {
      push(
        [
          "ERROR:",
          event.message,
          `at ${event.filename}:${event.lineno}:${event.colno}`,
          event.error?.stack ?? ""
        ].join("\n")
      );
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as any;
      push(
        [
          "UNHANDLED REJECTION:",
          String(reason?.message || reason),
          reason?.stack ?? ""
        ].join("\n")
      );
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    // --- CONSOLE HOOKING ---
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    console.log = (...args: unknown[]) => {
      push("[LOG] " + args.map(String).join(" "));
      originalConsole.log(...args);
    };

    console.warn = (...args: unknown[]) => {
      push("[WARN] " + args.map(String).join(" "));
      originalConsole.warn(...args);
    };

    console.error = (...args: unknown[]) => {
      push("[ERROR] " + args.map(String).join(" "));
      originalConsole.error(...args);
    };

    // Cleanup
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);

      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    };
  }, []);

  const t = true;
  if (t) {
    return null;
  }

  const [visible, setVisible] = useState(true);
  if (messages.length === 0 || !visible) {
    return null;
  }
  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: "30%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        fontSize: "12px",
        overflowY: "auto",
        zIndex: 9999,
        padding: "8px",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap"
      }}
    >
      <button
        style={{ position: "absolute", top: 4, right: 8, background: "#222", color: "#fff", border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer", zIndex: 10000 }}
        onClick={() => setVisible(false)}
      >
        Hide
      </button>
      {messages.map((msg, idx) => (
        <div key={idx} style={{ marginBottom: "4px" }}>
          {msg}
        </div>
      ))}
    </div>
  );

}