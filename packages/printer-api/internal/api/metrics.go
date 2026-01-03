package api

import (
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"escpos-service/internal/qlog"

	"github.com/go-chi/chi/v5"
)

type Metrics struct {
	mu            sync.Mutex
	totalRequests int64
	totalErrors   int64
	totalDuration time.Duration
	routes        map[string]*routeMetrics
	logger        qlog.Logger
}

type routeMetrics struct {
	requests int64
	errors   int64
	duration time.Duration
}

type MetricsSnapshot struct {
	TotalRequests int64                    `json:"totalRequests"`
	TotalErrors   int64                    `json:"totalErrors"`
	AvgDurationMs float64                  `json:"avgDurationMs"`
	Routes        map[string]RouteSnapshot `json:"routes"`
}

type RouteSnapshot struct {
	Requests      int64   `json:"requests"`
	Errors        int64   `json:"errors"`
	AvgDurationMs float64 `json:"avgDurationMs"`
}

func NewMetrics(logger qlog.Logger) *Metrics {
	return &Metrics{routes: make(map[string]*routeMetrics), logger: logger}
}

func (m *Metrics) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(sw, r)
		dur := time.Since(start)

		pattern := routePattern(r)
		if pattern == "" {
			pattern = r.URL.Path
		}

		m.observe(pattern, r.Method, sw.status, dur)
		logger := qlog.FromContext(r.Context(), m.logger)
		logger.Info("http_request",
			qlog.String("method", r.Method),
			qlog.String("path", r.URL.Path),
			qlog.String("route", pattern),
			qlog.Int("status", sw.status),
			qlog.Duration("duration", dur),
		)
	})
}

func (m *Metrics) observe(pattern, method string, status int, dur time.Duration) {
	key := method + " " + pattern
	isErr := status >= 400

	m.mu.Lock()
	defer m.mu.Unlock()

	m.totalRequests++
	m.totalDuration += dur
	if isErr {
		m.totalErrors++
	}

	rm, ok := m.routes[key]
	if !ok {
		rm = &routeMetrics{}
		m.routes[key] = rm
	}
	rm.requests++
	rm.duration += dur
	if isErr {
		rm.errors++
	}
}

func (m *Metrics) Snapshot() MetricsSnapshot {
	m.mu.Lock()
	defer m.mu.Unlock()

	snap := MetricsSnapshot{
		TotalRequests: m.totalRequests,
		TotalErrors:   m.totalErrors,
		AvgDurationMs: avgDurationMs(m.totalRequests, m.totalDuration),
		Routes:        make(map[string]RouteSnapshot),
	}

	for key, rm := range m.routes {
		snap.Routes[key] = RouteSnapshot{
			Requests:      rm.requests,
			Errors:        rm.errors,
			AvgDurationMs: avgDurationMs(rm.requests, rm.duration),
		}
	}

	return snap
}

func (m *Metrics) RenderPrometheus() string {
	m.mu.Lock()
	defer m.mu.Unlock()

	var b strings.Builder
	b.WriteString("# HELP printer_api_requests_total Total HTTP requests.\n")
	b.WriteString("# TYPE printer_api_requests_total counter\n")
	fmt.Fprintf(&b, "printer_api_requests_total %d\n", m.totalRequests)
	for key, rm := range m.routes {
		method, route := splitRouteKey(key)
		fmt.Fprintf(&b, "printer_api_requests_total{method=%q,route=%q} %d\n", method, route, rm.requests)
	}

	b.WriteString("# HELP printer_api_errors_total Total HTTP errors (status >= 400).\n")
	b.WriteString("# TYPE printer_api_errors_total counter\n")
	fmt.Fprintf(&b, "printer_api_errors_total %d\n", m.totalErrors)
	for key, rm := range m.routes {
		method, route := splitRouteKey(key)
		fmt.Fprintf(&b, "printer_api_errors_total{method=%q,route=%q} %d\n", method, route, rm.errors)
	}

	b.WriteString("# HELP printer_api_request_duration_seconds Request duration summary.\n")
	b.WriteString("# TYPE printer_api_request_duration_seconds summary\n")
	fmt.Fprintf(&b, "printer_api_request_duration_seconds_sum %.6f\n", m.totalDuration.Seconds())
	fmt.Fprintf(&b, "printer_api_request_duration_seconds_count %d\n", m.totalRequests)
	for key, rm := range m.routes {
		method, route := splitRouteKey(key)
		fmt.Fprintf(&b, "printer_api_request_duration_seconds_sum{method=%q,route=%q} %.6f\n", method, route, rm.duration.Seconds())
		fmt.Fprintf(&b, "printer_api_request_duration_seconds_count{method=%q,route=%q} %d\n", method, route, rm.requests)
	}

	return b.String()
}

func (m *Metrics) WritePrometheus(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "text/plain; version=0.0.4")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(m.RenderPrometheus()))
}

func avgDurationMs(count int64, dur time.Duration) float64 {
	if count == 0 {
		return 0
	}
	return float64(dur.Milliseconds()) / float64(count)
}

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

func routePattern(r *http.Request) string {
	rctx := chi.RouteContext(r.Context())
	if rctx == nil {
		return ""
	}
	return rctx.RoutePattern()
}

func splitRouteKey(key string) (string, string) {
	parts := strings.SplitN(key, " ", 2)
	if len(parts) != 2 {
		return "UNKNOWN", key
	}
	return parts[0], parts[1]
}
