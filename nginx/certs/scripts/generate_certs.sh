#!/bin/bash
set -e

BASE_DIR="$(dirname "$0")/.."
CA_KEY="$BASE_DIR/ca/myCA.key"
CA_CRT="$BASE_DIR/ca/myCA.pem"

SERVER_KEY="$BASE_DIR/server/server.key"
SERVER_CSR="$BASE_DIR/server/server.csr"
SERVER_CRT="$BASE_DIR/server/server.crt"
SAN="$BASE_DIR/server/san.cnf"

# 1. Server private key
openssl genrsa -out $SERVER_KEY 2048

# 2. CSR
openssl req -new -key $SERVER_KEY -out $SERVER_CSR -subj "/CN=gmbh.local"

# 3. Certificate
openssl x509 -req \
  -in $SERVER_CSR \
  -CA $CA_CRT -CAkey $CA_KEY \
  -CAcreateserial \
  -out $SERVER_CRT \
  -days 36500 -sha256 \
  -extfile $SAN

echo "Server certificate generated:"
echo "$SERVER_CRT"
