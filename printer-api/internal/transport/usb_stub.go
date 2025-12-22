//go:build !cgo || (!linux && !darwin)

package transport

import (
	"errors"

	"escpos-service/internal/model"
)

func sendUSB(ref model.PrinterRef, payload []byte) error {
	_ = ref
	_ = payload
	return errors.New("usb printing not enabled in this build")
}
