package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"escpos-service/api/gen"
	"escpos-service/internal/config"
	"escpos-service/internal/discovery"
	"escpos-service/internal/escpos"
	"escpos-service/internal/model"
	"escpos-service/internal/qlog"
	"escpos-service/internal/transport"
)

type APIServer struct {
	cfg     config.Config
	metrics *Metrics
	logger  qlog.Logger
}

func (s *APIServer) Healthz(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *APIServer) Metrics(w http.ResponseWriter, r *http.Request) {
	s.metrics.WritePrometheus(w)
}

func (s *APIServer) DiscoverPrinters(w http.ResponseWriter, r *http.Request, params gen.DiscoverPrintersParams) {
	enableUSB := s.cfg.EnableUSB
	enableNet := s.cfg.EnableNetwork

	if params.Usb != nil {
		enableUSB = *params.Usb
	}
	if params.Network != nil {
		enableNet = *params.Network
	}

	timeout := s.cfg.ScanTimeout
	if params.TimeoutMs != nil && *params.TimeoutMs > 0 {
		timeout = time.Duration(*params.TimeoutMs) * time.Millisecond
	}

	maxHosts := s.cfg.MaxHostsDefault
	if params.MaxHosts != nil && *params.MaxHosts > 0 {
		maxHosts = *params.MaxHosts
	}

	ports := s.cfg.DefaultPorts
	if params.Ports != nil {
		ports = nil
		for _, s := range strings.Split(*params.Ports, ",") {
			s = strings.TrimSpace(s)
			if n, err := strconv.Atoi(s); err == nil && n > 0 {
				ports = append(ports, n)
			}
		}
		if len(ports) == 0 {
			ports = s.cfg.DefaultPorts
		}
	}

	var hostFilter map[byte]struct{}
	if params.Hosts != nil && strings.TrimSpace(*params.Hosts) != "" {
		var err error
		hostFilter, err = parseHostFilter(*params.Hosts)
		if err != nil {
			writeErr(w, http.StatusBadRequest, "invalid_host_filter", err.Error())
			return
		}
	}

	var out []model.Printer
	if enableNet {
		netRefs, err := discovery.DiscoverNetworkPrinters(timeout, maxHosts, ports, hostFilter)
		if err != nil {
			s.logger.Warn("network discovery failed", qlog.Error(err))
		}
		out = append(out, printersFromRefs(netRefs)...)
	}
	if enableUSB {
		usbRefs, err := discovery.DiscoverUSBPrinters()
		if err != nil {
			s.logger.Warn("usb discovery failed", qlog.Error(err))
		}
		out = append(out, printersFromRefs(usbRefs)...)
	}

	writeJSON(w, http.StatusOK, map[string]any{"printers": out, "count": len(out)})
}

func printersFromRefs(refs []model.PrinterRef) []model.Printer {
	if len(refs) == 0 {
		return nil
	}
	out := make([]model.Printer, 0, len(refs))
	for _, ref := range refs {
		out = append(out, model.PrinterFromRef(ref))
	}
	return out
}

func parseHostFilter(raw string) (map[byte]struct{}, error) {
	out := make(map[byte]struct{})
	for _, token := range strings.Split(raw, ",") {
		token = strings.TrimSpace(token)
		if token == "" {
			continue
		}
		if strings.Contains(token, "-") {
			parts := strings.SplitN(token, "-", 2)
			if len(parts) != 2 {
				return nil, fmt.Errorf("invalid range %q", token)
			}
			start, err := strconv.Atoi(strings.TrimSpace(parts[0]))
			if err != nil {
				return nil, fmt.Errorf("invalid range %q", token)
			}
			end, err := strconv.Atoi(strings.TrimSpace(parts[1]))
			if err != nil {
				return nil, fmt.Errorf("invalid range %q", token)
			}
			if start < 0 || start > 255 || end < 0 || end > 255 || start > end {
				return nil, fmt.Errorf("range out of bounds %q", token)
			}
			for i := start; i <= end; i++ {
				out[byte(i)] = struct{}{}
			}
			continue
		}
		val, err := strconv.Atoi(token)
		if err != nil || val < 0 || val > 255 {
			return nil, fmt.Errorf("invalid host %q", token)
		}
		out[byte(val)] = struct{}{}
	}
	return out, nil
}

func (s *APIServer) GetPrinter(w http.ResponseWriter, r *http.Request, id gen.PrinterId) {
	ref, err := resolvePrinterRef(string(id), s.cfg)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_printer_id", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, model.PrinterFromRef(ref))
}

func (s *APIServer) GetPrinterStatus(w http.ResponseWriter, r *http.Request, id gen.PrinterId) {
	ref, err := resolvePrinterRef(string(id), s.cfg)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_printer_id", err.Error())
		return
	}
	st, err := transport.GetPrinterStatus(ref)
	if err != nil {
		writeErr(w, http.StatusBadGateway, "status_failed", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, st)
}

func (s *APIServer) Print(w http.ResponseWriter, r *http.Request, id gen.PrinterId) {
	ref, err := resolvePrinterRef(string(id), s.cfg)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_printer_id", err.Error())
		return
	}

	body, err := io.ReadAll(io.LimitReader(r.Body, 2<<20))
	defer r.Body.Close()
	if err != nil {
		writeErr(w, http.StatusBadRequest, "read_failed", err.Error())
		return
	}

	var req escpos.PrintRequest
	if err := json.Unmarshal(body, &req); err != nil {
		writeErr(w, http.StatusBadRequest, "bad_json", err.Error())
		return
	}

	data, err := escpos.BuildPrintPayload(req)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "bad_print_request", err.Error())
		return
	}

	if err := transport.Send(ref, data); err != nil {
		writeErr(w, http.StatusBadGateway, "print_failed", err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "bytesSent": len(data)})
}

func (s *APIServer) GetQueue(w http.ResponseWriter, r *http.Request, id gen.PrinterId) {
	ref, err := resolvePrinterRef(string(id), s.cfg)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_printer_id", err.Error())
		return
	}
	depth, capacity, ok := transport.QueueInfo(ref)
	writeJSON(w, http.StatusOK, map[string]any{
		"supported": true,
		"queued":    depth,
		"capacity":  capacity,
		"active":    ok,
	})
}

func resolvePrinterRef(id string, cfg config.Config) (model.PrinterRef, error) {
	if ref, err := model.DecodePrinterRef(id); err == nil {
		return ref, nil
	}

	refs, err := discoverAllRefs(cfg, false)
	if err != nil {
		return model.PrinterRef{}, err
	}
	for _, ref := range refs {
		if model.StableIDFromRef(ref) == id {
			return ref, nil
		}
	}

	refs, err = discoverAllRefs(cfg, true)
	if err != nil {
		return model.PrinterRef{}, err
	}
	for _, ref := range refs {
		if model.StableIDFromRef(ref) == id {
			return ref, nil
		}
	}
	return model.PrinterRef{}, fmt.Errorf("printer not found")
}

func discoverAllRefs(cfg config.Config, force bool) ([]model.PrinterRef, error) {
	var refs []model.PrinterRef
	if cfg.EnableNetwork || force {
		netRefs, err := discovery.DiscoverNetworkPrinters(cfg.ScanTimeout, cfg.MaxHostsDefault, cfg.DefaultPorts, nil)
		if err != nil {
			return nil, err
		}
		refs = append(refs, netRefs...)
	}
	if cfg.EnableUSB || force {
		usbRefs, err := discovery.DiscoverUSBPrinters()
		if err != nil {
			return nil, err
		}
		refs = append(refs, usbRefs...)
	}
	return refs, nil
}
