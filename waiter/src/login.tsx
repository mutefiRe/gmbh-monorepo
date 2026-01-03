import { useState, type FormEvent } from "react";
import { Redirect } from "wouter";
import { useAuth } from "./auth-wrapper";
import { useAuthenticateUser } from "./types/queries";
import { useConnectionStatus } from "./context/ConnectionStatusContext";
import { ConnectionPill } from "./ui/connection-pill";
import { Button } from "./ui/button";
import { Notice } from "./ui/notice";
import logo from "./assets/logo-gmbhtext.svg";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [notice, setNotice] = useState<{ message: string; variant?: "info" | "warning" | "error" | "success" } | null>(null);
  const authenticateUserMutation = useAuthenticateUser();
  const auth = useAuth();
  const connection = useConnectionStatus();


  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    try {
      setNotice(null);
      const data = await authenticateUserMutation.mutateAsync({ username, password })
      auth.setToken(data.token);
    } catch (error) {
      setNotice({ message: "Login fehlgeschlagen. Bitte überprüfe deine Eingaben.", variant: "error" });
    }
  }

  function handleQRScan() {
    // TODO: Implement QR code scan logic
    setNotice({ message: "QR-Code Login ist aktuell noch nicht verfügbar.", variant: "info" });
  }

  if (auth.token) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-zoomIn">
        <div className="bg-primary-600 p-8 text-center">
          <div className="mx-auto mb-4 rounded-2xl bg-white p-3 w-fit">
            <img src={logo} alt="GmBh" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">g.m.b.h Bedienung</h1>
          <p className="text-primary-200 mt-2">Willkommen zurück</p>
        </div>

        <div className="p-8">
          {!showQR ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {notice && <Notice message={notice.message} variant={notice.variant} />}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Benutzername</label>
                <input
                  type="text"
                  placeholder="z.B. waiter"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Passwort</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white text-slate-900"
                  required
                />
              </div>
              <Button type="submit" className="py-3.5 font-bold">
                Login
              </Button>
              {/* <Button
                type="button"
                variant="secondary"
                onClick={() => setShowQR(true)}
              >
                Oder mit QR-Code anmelden
              </Button> */}
              <div className="flex justify-center">
                <ConnectionPill status={connection.status} compact />
              </div>
              <div className="text-center text-xs text-slate-400">
                Wenn nichts lädt: App zurücksetzen.
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-500 underline hover:text-slate-700"
                  onClick={() => {
                    if (window.confirm("App wirklich zurücksetzen?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  App zurücksetzen
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {notice && <Notice message={notice.message} variant={notice.variant} />}
              <div className="w-40 h-40 bg-slate-100 flex items-center justify-center rounded-2xl border border-slate-200">
                <span className="text-slate-500 text-sm">QR-Code Scanner</span>
              </div>
              <Button
                className="py-3.5 font-bold"
                fullWidth
                onClick={handleQRScan}
              >
                QR-Code scannen
              </Button>
              <div className="flex justify-center">
                <ConnectionPill status={connection.status} compact />
              </div>
              <button
                className="text-primary-700 font-semibold underline"
                onClick={() => setShowQR(false)}
              >
                Zurück zum Login
              </button>
              <div className="text-center text-xs text-slate-400">
                Wenn nichts lädt: App zurücksetzen.
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-500 underline hover:text-slate-700"
                  onClick={() => {
                    if (window.confirm("App wirklich zurücksetzen?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  App zurücksetzen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
