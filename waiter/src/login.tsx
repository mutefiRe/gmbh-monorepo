import { useState, type FormEvent } from "react";
import { useAuthenticateUser } from "./types/queries";
import { useAuth } from "./auth-wrapper";
import { Redirect } from "wouter";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showQR, setShowQR] = useState(false);
  const authenticateUserMutation = useAuthenticateUser();
  const auth = useAuth();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    try {
      const data = await authenticateUserMutation.mutateAsync({ username, password })
      auth.setToken(data.token);
    } catch (error) {
      alert("Login fehlgeschlagen");
    }
  }

  function handleQRScan() {
    // TODO: Implement QR code scan logic
    alert("QR code scan initiated");
  }

  if (auth.token) {
    return <Redirect to="/" />;
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      {!showQR ? (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <div>
            {authenticateUserMutation.isError && (
              <p className="text-red-500 text-sm mb-2">Fehler beim Login. Bitte überprüfe deine Eingaben.</p>
            )}
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
          <button type="button" className="bg-gray-100 py-2 rounded hover:bg-gray-200" onClick={() => setShowQR(true)}>
            Oder mit QR-Code anmelden
          </button>
          <p className="text-xs text-gray-400 text-center">
            Wenn nichts lädt: App zurücksetzen.
          </p>
          <button
            type="button"
            className="text-xs font-semibold text-gray-500 underline hover:text-gray-700"
            onClick={() => {
              if (window.confirm("App wirklich zurücksetzen?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
          >
            App zurücksetzen
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded">
            {/* QR code scanner placeholder */}
            <span className="text-gray-500">QR-Code Scanner</span>
          </div>
          <button className="bg-gray-100 py-2 rounded hover:bg-gray-200 w-full" onClick={handleQRScan}>
            QR-Code scannen
          </button>
          <button className="text-blue-500 underline" onClick={() => setShowQR(false)}>
            Zurück zum Login
          </button>
          <p className="text-xs text-gray-400 text-center">
            Wenn nichts lädt: App zurücksetzen.
          </p>
          <button
            type="button"
            className="text-xs font-semibold text-gray-500 underline hover:text-gray-700"
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
      )}
    </div>
  );
}
