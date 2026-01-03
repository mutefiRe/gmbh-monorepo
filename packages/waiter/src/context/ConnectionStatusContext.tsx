import { createContext, useContext, type ReactNode } from "react";
import { useConnectionStatusCheck, type ConnectionState } from "../hooks/useConnectionStatus";

const ConnectionStatusContext = createContext<ConnectionState | undefined>(undefined);

export function ConnectionStatusProvider({ children }: { children: ReactNode }) {
  const connection = useConnectionStatusCheck();
  return (
    <ConnectionStatusContext.Provider value={connection}>
      {children}
    </ConnectionStatusContext.Provider>
  );
}

export function useConnectionStatus() {
  const ctx = useContext(ConnectionStatusContext);
  if (!ctx) throw new Error("useConnectionStatus must be used within ConnectionStatusProvider");
  return ctx;
}
