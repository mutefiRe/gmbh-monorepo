#!/bin/bash
set -e

BASE_DIR="$(dirname "$0")/.."
CA_KEY="$BASE_DIR/ca/myCA.key"
CA_CRT="$BASE_DIR/ca/myCA.pem"

SERVER_KEY="$BASE_DIR/server/server.key"
SERVER_CSR="$BASE_DIR/server/server.csr"
SERVER_CRT="$BASE_DIR/server/server.crt"
SAN="$BASE_DIR/server/san.cnf"

CERT_HOSTS="${CERT_HOSTS:-gmbh,gmbh.local,localhost}"
CERT_IPS="${CERT_IPS:-}"
CERT_CN="${CERT_CN:-gmbh.local}"

# Create CA if missing
if [ ! -f "$CA_KEY" ] || [ ! -f "$CA_CRT" ]; then
  mkdir -p "$(dirname "$CA_KEY")"
  openssl genrsa -out "$CA_KEY" 2048
  openssl req -x509 -new -nodes -key "$CA_KEY" -sha256 -days 36500 -out "$CA_CRT" -subj "/CN=gmbh-local-ca"
fi

# Detect IPv4 addresses for default route + main interfaces (no virtual/tunnel IPs)
detect_ipv4s() {
  local ips=()
  if command -v ipconfig >/dev/null 2>&1; then
    for iface in en0 en1; do
      ipconfig getifaddr "$iface" >/dev/null 2>&1 && ips+=("$(ipconfig getifaddr "$iface")")
    done
  elif command -v ip >/dev/null 2>&1; then
    local dev
    dev="$(ip route get 1.1.1.1 2>/dev/null | awk '/dev/ {for (i=1;i<=NF;i++) if ($i=="dev") print $(i+1)}' | head -n1)"
    if [ -n "$dev" ]; then
      ip -4 addr show dev "$dev" | awk '/inet / {print $2}' | cut -d/ -f1 | while read -r ip; do
        [ -n "$ip" ] && ips+=("$ip")
      done
    fi
  fi
  printf "%s\n" "${ips[@]}" | awk 'NF' | sort -u | paste -sd "," -
}

if [ -z "$CERT_IPS" ]; then
  CERT_IPS="$(detect_ipv4s)"
fi

# Build SAN config
SAN_ENTRIES=""
IFS=',' read -ra HOSTS <<< "$CERT_HOSTS"
for HOST in "${HOSTS[@]}"; do
  HOST_TRIM="$(echo "$HOST" | xargs)"
  if [ -n "$HOST_TRIM" ]; then
    SAN_ENTRIES="${SAN_ENTRIES}DNS:${HOST_TRIM},"
  fi
done
IFS=',' read -ra IPS <<< "$CERT_IPS"
for IP in "${IPS[@]}"; do
  IP_TRIM="$(echo "$IP" | xargs)"
  if [ -n "$IP_TRIM" ]; then
    SAN_ENTRIES="${SAN_ENTRIES}IP:${IP_TRIM},"
  fi
done
SAN_ENTRIES="${SAN_ENTRIES%,}"
echo "subjectAltName=${SAN_ENTRIES}" > "$SAN"

# 1. Server private key
openssl genrsa -out "$SERVER_KEY" 2048

# 2. CSR
openssl req -new -key "$SERVER_KEY" -out "$SERVER_CSR" -subj "/CN=${CERT_CN}"

# 3. Certificate
openssl x509 -req \
  -in "$SERVER_CSR" \
  -CA "$CA_CRT" -CAkey "$CA_KEY" \
  -CAcreateserial \
  -out "$SERVER_CRT" \
  -days 36500 -sha256 \
  -extfile "$SAN"

echo "Server certificate generated:"
echo "$SERVER_CRT"
