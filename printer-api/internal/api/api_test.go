package api

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"escpos-service/internal/config"
	"escpos-service/internal/model"
	"escpos-service/internal/qlog"
	"escpos-service/internal/transport"
)

func TestHealthz(t *testing.T) {
	r := NewRouter(config.Config{}, qlog.NewNopLogger())
	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rr := httptest.NewRecorder()

	r.ServeHTTP(rr, req)
	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.Code)
	}

	var body map[string]any
	if err := json.Unmarshal(rr.Body.Bytes(), &body); err != nil {
		t.Fatalf("bad json: %v", err)
	}
	if body["ok"] != true {
		t.Fatalf("expected ok true, got %v", body["ok"])
	}
}

func TestGetPrinterByID(t *testing.T) {
	r := NewRouter(config.Config{}, qlog.NewNopLogger())
	ref := model.PrinterRef{Transport: "network", Network: &model.NetworkRef{IP: "192.168.0.10", Port: 9100}}
	id := model.EncodePrinterRef(ref)

	req := httptest.NewRequest(http.MethodGet, "/v1/printers/"+id, nil)
	rr := httptest.NewRecorder()

	r.ServeHTTP(rr, req)
	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.Code)
	}

	var p model.Printer
	if err := json.Unmarshal(rr.Body.Bytes(), &p); err != nil {
		t.Fatalf("bad json: %v", err)
	}
	if p.ID != id {
		if p.ID == "" {
			t.Fatalf("expected id to be set")
		}
	}
	if p.StableID == "" {
		t.Fatalf("expected stableId to be set")
	}
	if p.Transport != "network" {
		t.Fatalf("expected transport network, got %s", p.Transport)
	}
}

func TestPrintRawBase64(t *testing.T) {
	r := NewRouter(config.Config{}, qlog.NewNopLogger())
	ref := model.PrinterRef{Transport: "network", Network: &model.NetworkRef{IP: "127.0.0.1", Port: 9100}}
	id := model.EncodePrinterRef(ref)

	prev := transport.SendFunc
	sent := []byte{}
	transport.SendFunc = func(_ model.PrinterRef, payload []byte) error {
		sent = append([]byte(nil), payload...)
		return nil
	}
	defer func() { transport.SendFunc = prev }()

	body := `{"rawBase64":"` + base64.StdEncoding.EncodeToString([]byte("hi")) + `"}`
	req := httptest.NewRequest(http.MethodPost, "/v1/printers/"+id+"/print", strings.NewReader(body))
	rr := httptest.NewRecorder()

	r.ServeHTTP(rr, req)
	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.Code)
	}
	if string(sent) != "hi" {
		t.Fatalf("expected payload 'hi', got %q", string(sent))
	}
}

func TestQueueNotSupported(t *testing.T) {
	r := NewRouter(config.Config{}, qlog.NewNopLogger())
	ref := model.PrinterRef{Transport: "network", Network: &model.NetworkRef{IP: "127.0.0.1", Port: 9100}}
	id := model.EncodePrinterRef(ref)

	req := httptest.NewRequest(http.MethodGet, "/v1/printers/"+id+"/queue", nil)
	rr := httptest.NewRecorder()

	r.ServeHTTP(rr, req)
	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.Code)
	}
}

func TestMetricsSnapshot(t *testing.T) {
	r := NewRouter(config.Config{}, qlog.NewNopLogger())
	req1 := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rr1 := httptest.NewRecorder()
	r.ServeHTTP(rr1, req1)

	req2 := httptest.NewRequest(http.MethodGet, "/metrics", nil)
	rr2 := httptest.NewRecorder()
	r.ServeHTTP(rr2, req2)
	if rr2.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr2.Code)
	}

	body := rr2.Body.String()
	if !strings.Contains(body, "printer_api_requests_total") {
		t.Fatalf("expected prometheus metrics output, got %q", body)
	}
}
