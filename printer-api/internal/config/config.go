package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	ListenAddr      string
	ScanTimeout     time.Duration
	MaxHostsDefault int
	EnableUSB       bool
	EnableNetwork   bool
	DefaultPorts    []int
	PrintThrottle   time.Duration
	PrintQueueSize  int
}

func ConfigFromEnv() Config {
	ports := []int{9100}
	if p := os.Getenv("DEFAULT_PORTS"); p != "" {
		ports = nil
		for _, s := range strings.Split(p, ",") {
			s = strings.TrimSpace(s)
			if s == "" {
				continue
			}
			if n, err := strconv.Atoi(s); err == nil && n > 0 {
				ports = append(ports, n)
			}
		}
		if len(ports) == 0 {
			ports = []int{9100}
		}
	}

	cfg := Config{
		ListenAddr:      getenv("LISTEN_ADDR", ":8761"),
		ScanTimeout:     time.Duration(getenvInt("SCAN_TIMEOUT_MS", 250)) * time.Millisecond,
		MaxHostsDefault: getenvInt("SCAN_MAX_HOSTS", 256),
		EnableUSB:       getenvBool("ENABLE_USB", true),
		EnableNetwork:   getenvBool("ENABLE_NETWORK", true),
		DefaultPorts:    ports,
		PrintThrottle:   time.Duration(getenvInt("PRINT_THROTTLE_MS", 0)) * time.Millisecond,
		PrintQueueSize:  getenvInt("PRINT_QUEUE_SIZE", 100),
	}
	return cfg
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

func getenvInt(k string, def int) int {
	v := os.Getenv(k)
	if v == "" {
		return def
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return def
	}
	return n
}

func getenvBool(k string, def bool) bool {
	v := os.Getenv(k)
	if v == "" {
		return def
	}
	v = strings.ToLower(v)
	return v == "1" || v == "true" || v == "yes"
}
