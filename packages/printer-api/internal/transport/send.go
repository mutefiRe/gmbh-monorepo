package transport

import (
	"errors"
	"fmt"
	"net"
	"time"

	"escpos-service/internal/model"
)

var SendFunc = sendToPrinter

func Send(ref model.PrinterRef, payload []byte) error {
	return enqueuePrint(ref, payload)
}

func sendToPrinter(ref model.PrinterRef, payload []byte) error {
	switch ref.Transport {
	case "network":
		addr := net.JoinHostPort(ref.Network.IP, fmt.Sprintf("%d", ref.Network.Port))
		c, err := net.DialTimeout("tcp", addr, 800*time.Millisecond)
		if err != nil {
			return err
		}
		defer c.Close()
		_ = c.SetDeadline(time.Now().Add(3 * time.Second))
		_, err = c.Write(payload)
		return err
	case "usb":
		return sendUSB(ref, payload)
	default:
		return errors.New("unknown transport")
	}
}

func sendImmediate(ref model.PrinterRef, payload []byte) error {
	applyThrottle(ref)
	return SendFunc(ref, payload)
}
