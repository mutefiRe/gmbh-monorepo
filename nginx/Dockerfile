FROM order as order_build
FROM dashboard as dashboard_build

FROM nginx:latest

COPY --from=order_build /app/dist/ /usr/share/nginx/html/