#!/usr/bin/env bash
set -euo pipefail

IMAGE="${IMAGE:-}"
CONTEXT="${CONTEXT:-}"
DOCKERFILE="${DOCKERFILE:-Dockerfile}"
TAG="${TAG:-latest}"
REMOTE="${REMOTE:-}"
REMOTE_PATH="${REMOTE_PATH:-/tmp}"

if [[ -z "$IMAGE" || -z "$CONTEXT" || -z "$REMOTE" ]]; then
  echo "Usage:"
  echo "  IMAGE=repo/name CONTEXT=./path REMOTE=user@host [DOCKERFILE=...] [TAG=...] [REMOTE_PATH=/tmp] make transfer-image"
  echo ""
  echo "Example:"
  echo "  IMAGE=gmbh-api CONTEXT=api REMOTE=pi@192.168.1.10 TAG=latest make transfer-image"
  exit 1
fi

TAR_NAME="$(echo "${IMAGE}:${TAG}" | tr '/:' '_').tar"
TAR_PATH="/tmp/${TAR_NAME}"

echo "Building ${IMAGE}:${TAG} from ${CONTEXT} (${DOCKERFILE})..."
docker build -t "${IMAGE}:${TAG}" -f "${CONTEXT}/${DOCKERFILE}" "${CONTEXT}"

echo "Saving image to ${TAR_PATH}..."
docker save "${IMAGE}:${TAG}" -o "${TAR_PATH}"

echo "Copying to ${REMOTE}:${REMOTE_PATH}/${TAR_NAME}..."
scp "${TAR_PATH}" "${REMOTE}:${REMOTE_PATH}/${TAR_NAME}"

echo ""
echo "On the target host:"
echo "  docker load -i ${REMOTE_PATH}/${TAR_NAME}"
echo "  docker tag ${IMAGE}:${TAG} ${IMAGE}:latest"
echo ""
echo "If your compose uses a different image name, tag that instead."
