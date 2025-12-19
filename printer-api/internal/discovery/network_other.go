//go:build !linux

package discovery

import (
	"time"

	"escpos-service/internal/model"
)

func DiscoverNetworkPrinters(timeout time.Duration, maxHosts int, ports []int, hostFilter map[byte]struct{}) ([]model.PrinterRef, error) {
	return nil, nil
}
