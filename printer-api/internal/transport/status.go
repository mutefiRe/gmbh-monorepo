package transport

import (
	"errors"
	"fmt"
	"net"
	"time"

	"escpos-service/internal/model"
)

type PrinterStatus struct {
	Transport string          `json:"transport"`
	Online    bool            `json:"online"`
	Raw       map[string]byte `json:"raw,omitempty"`
	Flags     map[string]bool `json:"flags,omitempty"`
}

func GetPrinterStatus(ref model.PrinterRef) (PrinterStatus, error) {
	switch ref.Transport {
	case "network":
		return statusNetwork(ref)
	case "usb":
		return PrinterStatus{Transport: "usb", Online: true, Flags: map[string]bool{"statusLimited": true}}, nil
	default:
		return PrinterStatus{}, errors.New("unknown transport")
	}
}

func statusNetwork(ref model.PrinterRef) (PrinterStatus, error) {
	addr := net.JoinHostPort(ref.Network.IP, fmt.Sprintf("%d", ref.Network.Port))
	c, err := net.DialTimeout("tcp", addr, 400*time.Millisecond)
	if err != nil {
		return PrinterStatus{Transport: "network", Online: false}, err
	}
	defer c.Close()
	_ = c.SetDeadline(time.Now().Add(900 * time.Millisecond))

	raw := map[string]byte{}
	flags := map[string]bool{}

	for _, n := range []byte{1, 2, 3, 4} {
		_, _ = c.Write([]byte{0x10, 0x04, n})
		buf := make([]byte, 1)
		_, err := c.Read(buf)
		if err != nil {
			continue
		}
		raw[fmt.Sprintf("DLE_EOT_%d", n)] = buf[0]
		decodeDLEEOT(n, buf[0], flags)
	}

	online := true
	if flags["offline"] || flags["paperOut"] {
		online = false
	}

	return PrinterStatus{Transport: "network", Online: online, Raw: raw, Flags: flags}, nil
}

func decodeDLEEOT(n byte, b byte, flags map[string]bool) {
	switch n {
	case 1:
		if b&(1<<3) != 0 {
			flags["offline"] = true
		}
		if b&(1<<5) != 0 {
			flags["paperFeed"] = true
		}
	case 2:
		if b&(1<<2) != 0 {
			flags["coverOpen"] = true
		}
		if b&(1<<3) != 0 {
			flags["paperFeeding"] = true
		}
		if b&(1<<5) != 0 {
			flags["paperOut"] = true
		}
	case 3:
		if b&(1<<3) != 0 {
			flags["cutterError"] = true
		}
		if b&(1<<6) != 0 {
			flags["fatalError"] = true
		}
	case 4:
		if b&(1<<2) != 0 {
			flags["paperNearEnd"] = true
		}
		if b&(1<<5) != 0 {
			flags["paperOut"] = true
		}
	}
}
