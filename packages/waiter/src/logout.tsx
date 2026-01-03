import { useEffect } from "react";
import { useAuth } from "./auth-wrapper";

export function Logout() {
  const auth = useAuth();

  useEffect(() => {
    auth.logout();
  }, [auth]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Abmeldung</h1>
      <p>Du wurdest erfolgreich abgemeldet.</p>
      <a href="/login" className="text-blue-500 underline">Zur Login-Seite</a>
    </div>
  );
}