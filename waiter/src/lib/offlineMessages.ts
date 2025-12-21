export function pendingOrdersMessage(count: number, canReachServer: boolean) {
  if (count <= 0) return null;
  const plural = count === 1 ? "" : "en";
  if (canReachServer) {
    return `Ausstehend: ${count} Bestellung${plural} wird gerade gesendet.`;
  }
  return `Offline: ${count} ausstehende Bestellung${plural} werden gesendet, sobald die Verbindung wieder da ist.`;
}

export function pendingPaymentsMessage(count: number, canReachServer: boolean) {
  if (count <= 0) return null;
  const plural = count === 1 ? "" : "en";
  const verb = count === 1 ? "wird" : "werden";
  if (canReachServer) {
    return `Ausstehende Zahlung${plural}: ${count} ${verb} gerade gesendet.`;
  }
  return `Ausstehende Zahlung${plural}: ${count} ${verb} gesendet, sobald die Verbindung wieder da ist.`;
}

export function offlineOrderPaymentMessage() {
  return "Ausstehend: Diese Bestellung ist noch nicht gesendet. Zahlungen werden gespeichert und nach dem Versand übertragen.";
}
