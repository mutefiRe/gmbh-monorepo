package api

import (
	"net/http"

	"escpos-service/internal/qlog"

	"github.com/google/uuid"
)

const requestIDHeader = "X-Request-Id"

func requestLoggerMiddleware(base qlog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			requestID := r.Header.Get(requestIDHeader)
			if requestID == "" {
				requestID = uuid.NewString()
			}
			w.Header().Set(requestIDHeader, requestID)

			logger := base.With(qlog.String("request_id", requestID))
			ctx := qlog.WithLogger(r.Context(), logger)
			ctx = qlog.WithRequestID(ctx, requestID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
