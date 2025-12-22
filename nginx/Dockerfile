FROM node:24.12-alpine AS waiter_build
WORKDIR /app
ARG VITE_API_TARGET
ENV VITE_API_TARGET=${VITE_API_TARGET}
COPY waiter/package*.json ./waiter/
RUN cd waiter && npm ci
COPY waiter ./waiter
RUN cd waiter && npm run build

FROM node:24.12-alpine AS admin_build
WORKDIR /app
ARG VITE_API_TARGET
ENV VITE_API_TARGET=${VITE_API_TARGET}
COPY admin/package*.json ./admin/
RUN cd admin && npm ci
COPY admin ./admin
RUN cd admin && npm run build

FROM nginx:alpine
WORKDIR /app
COPY --from=waiter_build /app/waiter/dist/ /app/waiter/
COPY --from=admin_build /app/admin/dist/ /app/admin/
