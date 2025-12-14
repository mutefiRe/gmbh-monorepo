import { useContext } from "react";
import { useAppContext } from "@/App";

export function SettingsPage() {
  const { } = useAppContext();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Einstellungen</h1>
      <p>Hier können Sie die allgemeinen Einstellungen der Anwendung anpassen.</p>
      {/* Weitere Einstellungskomponenten können hier hinzugefügt werden */}
    </div>
  );
}