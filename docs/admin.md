# Admin-Dokumentation

## Ubersicht
Diese Doku beschreibt die empfohlene Netzwerkkonfiguration, die Drucker-Einrichtung und den Zugriff auf Bedienung/Admin im lokalen Betrieb.

## Netzwerk (Router + DHCP)
- Der Router stellt das lokale LAN bereit und ist DHCP-Server.
- Das g.m.b.h.-Netz ist ein eigenes Subnetz (LAN), nicht das WAN.
- Standard-Gateway: `192.168.100.1`
- g.m.b.h-Server: `192.168.100.100`
- Wichtig: Die Server-IP per MAC-Address-Bindung fixieren (DHCP-Reservation).

Beispiel-Subnetz:
- Netzwerk: `192.168.100.0/24`
- Gateway: `192.168.100.1`
- Server: `192.168.100.100` (fix)

## Drucker-Setup (WLAN)
1) Drucker per USB am Rechner anschliessen.
2) Mit dem HOIN WiFi Tool auf DHCP-Client (STA) umstellen.
3) Dem Drucker eine feste IP geben (statisch).
4) Im Router eine MAC-Address-Bindung setzen.

Wichtig: Die statische Drucker-IP und die DHCP-Reservation muessen identisch sein.

## Drucker-Setup (USB)
Optional koennen USB-Drucker direkt am g.m.b.h-Server betrieben werden. Dann ist keine WLAN-Konfiguration noetig.

## Zugriff (Bedienung und Admin)
- Bedienung: `https://192.168.100.100`
  - Auf dem Geraet "Add to Homescreen" fuer Vollbild-Betrieb nutzen.
- Admin: `https://192.168.100.100/admin`

## Betriebshinweise
- Wenn Clients die Seite nicht laden: WLAN pruefen und `192.168.100.100` testen.
- Bei Druckproblemen: IP-Bindung im Router und die statische Drucker-IP pruefen.
- Smartphones zeigen oft "Keine Internetverbindung" an. Bitte "Trotzdem verbunden bleiben" waehlen, damit das WLAN aktiv bleibt.
- Die Admin-Oberflaeche prueft Drucker-Verbindungen und zeigt den Erreichbarkeitsstatus im Systemstatus.
- Alte Events regelmaessig loeschen, damit die Datenbank schlank bleibt. Vor dem Loeschen kann man ein Event als Vorlage (Template) fuer neue Events nutzen (Stammdaten uebernehmen, Bestellungen entfernen).
- Optionaler Uplink am Router (WAN) ermoeglicht Remote-Wartung, z.B. per Tailscale, wenn der Server entsprechend eingerichtet ist.

## Deployment & Updates (Advanced)
Diese Schritte sind fuer Entwickler gedacht.

### Voraussetzungen
- Server mit Docker (ohne sudo), z.B. Benutzer in der `docker`-Gruppe.
- Zugriff per SSH.

### Deployment (prod/ per SCP)
1) Lokales `prod/` Verzeichnis auf den Server kopieren:
   ```sh
   scp -r prod gmbh@192.168.100.100:/opt/gmbh
   ```
2) Auf dem Server in das Verzeichnis wechseln:
   ```sh
   cd /opt/gmbh/prod
   ```
3) Stack starten:
   ```sh
   make up-d
   ```

### Updates einspielen
1) In `prod/` wechseln:
   ```sh
   cd /opt/gmbh/prod
   ```
2) Aktuelle Images laden:
   ```sh
   docker compose pull
   ```
3) Services neu starten:
   ```sh
   make up-d
   ```

Hinweis: `make up-d` startet den Stack neu und zieht die neuesten Images, falls `docker compose pull` vorher ausgefuehrt wurde.
