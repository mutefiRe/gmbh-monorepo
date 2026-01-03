package discovery

import (
	"net"
	"strconv"
	"strings"
	"time"

	"escpos-service/internal/model"
)

func discoverExtraHosts(timeout time.Duration, ports []int, extraHosts []string) []model.PrinterRef {
	var out []model.PrinterRef
	seen := map[string]bool{}

	addRef := func(host string, port int) {
		ref := model.PrinterRef{
			Transport: "network",
			Network:   &model.NetworkRef{IP: host, Port: port},
		}
		id := model.EncodePrinterRef(ref)
		if seen[id] {
			return
		}
		seen[id] = true
		out = append(out, ref)
	}

	for _, raw := range extraHosts {
		host, hostPorts := parseHostSpec(raw, ports)
		if host == "" {
			continue
		}
		for _, port := range hostPorts {
			addr := net.JoinHostPort(host, strconv.Itoa(port))
			c, err := net.DialTimeout("tcp", addr, timeout)
			if err != nil {
				continue
			}
			_ = c.Close()
			addRef(host, port)
		}
	}

	return out
}

func parseHostSpec(raw string, defaultPorts []int) (string, []int) {
	host := strings.TrimSpace(raw)
	if host == "" {
		return "", nil
	}

	var ports []int
	if strings.HasPrefix(host, "[") {
		if h, p, err := net.SplitHostPort(host); err == nil {
			host = h
			if port, err := strconv.Atoi(p); err == nil && port > 0 {
				ports = []int{port}
			}
		}
	} else if strings.Count(host, ":") == 1 {
		parts := strings.SplitN(host, ":", 2)
		if len(parts) == 2 && parts[0] != "" && parts[1] != "" {
			if port, err := strconv.Atoi(parts[1]); err == nil && port > 0 {
				host = parts[0]
				ports = []int{port}
			}
		}
	}

	if len(ports) == 0 {
		ports = defaultPorts
	}
	return host, ports
}
