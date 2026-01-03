# syntax=docker/dockerfile:1
FROM golang:1.25.3-alpine3.22 AS build

WORKDIR /src
ENV GOTOOLCHAIN=go1.25.3

RUN apk add --no-cache build-base libusb-dev ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -o /out/printer-api ./cmd/printer-api

FROM alpine:3.22
WORKDIR /
RUN apk add --no-cache libusb ca-certificates
COPY --from=build /out/printer-api /printer-api
COPY --from=build /src/api/spec/openapi.yaml /api/spec/openapi.yaml
EXPOSE 8761
ENTRYPOINT ["/printer-api"]
