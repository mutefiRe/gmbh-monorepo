import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UtensilsCrossed, Loader2 } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.login(username, password);
      login(response.token);
    } catch (err: any) {
      setError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-zoomIn">
        <div className="bg-primary-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <UtensilsCrossed size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">GmBh Admin</h1>
          <p className="text-primary-200 mt-2">Willkommen zurück</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-fadeIn">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Benutzername</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-slate-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="z.B. admin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Passwort</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <PrimaryButton
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            icon={isLoading ? <Loader2 size={20} className="animate-spin" /> : undefined}
          >
            {isLoading ? 'Anmelden...' : 'Anmelden'}
          </PrimaryButton>

          <div className="text-center text-xs text-slate-400 mt-4">
            Demo: admin / admin
          </div>
          <div className="text-center text-xs text-slate-400">
            Wenn nichts lädt: App zurücksetzen.
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("App wirklich zurücksetzen?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="mt-3 text-xs font-semibold text-slate-500 underline hover:text-slate-700"
            >
              App zurücksetzen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
