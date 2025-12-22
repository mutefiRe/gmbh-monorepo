FROM node:24.16.0-alpine AS build
WORKDIR /app
ARG VITE_API_TARGET
ENV VITE_API_TARGET=${VITE_API_TARGET}
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.26.1-alpine
COPY --from=build /app/dist /usr/share/nginx/html
