//go:build !linux && !darwin

package discovery

import (
	"errors"

	"escpos-service/internal/model"
)

func DiscoverUSBPrinters() ([]model.PrinterRef, error) {
	return nil, errors.New("usb discovery is only supported on linux")
}
