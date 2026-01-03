package api

import (
	"encoding/json"
	"net/http"

	"escpos-service/api/gen"
	"escpos-service/internal/config"
	"escpos-service/internal/qlog"

	"github.com/go-chi/chi/v5"
)

func NewRouter(cfg config.Config, logger qlog.Logger) http.Handler {
	if logger == nil {
		logger = qlog.NewNopLogger()
	}
	r := chi.NewRouter()
	metrics := NewMetrics(logger)
	r.Use(requestLoggerMiddleware(logger))
	r.Use(metrics.Middleware)
	r.Get("/openapi.yaml", serveOpenAPI)
	r.Get("/docs", func(w http.ResponseWriter, r *http.Request) {
		writeSwaggerUI(w, "/openapi.yaml")
	})
	srv := &APIServer{cfg: cfg, metrics: metrics, logger: logger}
	if cfg.DiscoveryRefresh > 0 {
		srv.StartDiscoveryLoop()
	}
	gen.HandlerFromMux(srv, r)
	return r
}

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, code int, typ, msg string) {
	writeJSON(w, code, map[string]any{"error": map[string]any{"type": typ, "message": msg}})
}
