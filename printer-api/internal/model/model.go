package model

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
)

type Printer struct {
	ID        string            `json:"id"`
	StableID  string            `json:"stableId,omitempty"`
	Transport string            `json:"transport"`
	Network   *NetworkRef       `json:"network,omitempty"`
	USB       *USBRef           `json:"usb,omitempty"`
	Labels    map[string]string `json:"labels,omitempty"`
}

type PrinterRef struct {
	Transport string      `json:"transport"`
	Network   *NetworkRef `json:"network,omitempty"`
	USB       *USBRef     `json:"usb,omitempty"`
}

type NetworkRef struct {
	IP   string `json:"ip"`
	Port int    `json:"port"`
	MAC  string `json:"mac,omitempty"`
}

type USBRef struct {
	VID          uint16 `json:"vid"`
	PID          uint16 `json:"pid"`
	Serial       string `json:"serial,omitempty"`
	Manufacturer string `json:"manufacturer,omitempty"`
	Product      string `json:"product,omitempty"`
}

func EncodePrinterRef(ref PrinterRef) string {
	b, _ := json.Marshal(ref)
	return base64.RawURLEncoding.EncodeToString(b)
}

func DecodePrinterRef(id string) (PrinterRef, error) {
	raw, err := base64.RawURLEncoding.DecodeString(id)
	if err != nil {
		return PrinterRef{}, err
	}
	var ref PrinterRef
	if err := json.Unmarshal(raw, &ref); err != nil {
		return PrinterRef{}, err
	}
	if ref.Transport != "network" && ref.Transport != "usb" {
		return PrinterRef{}, errors.New("transport must be 'network' or 'usb'")
	}
	if ref.Transport == "network" && (ref.Network == nil || ref.Network.IP == "" || ref.Network.Port == 0) {
		return PrinterRef{}, errors.New("network ref missing ip/port")
	}
	if ref.Transport == "usb" && (ref.USB == nil || ref.USB.VID == 0 || ref.USB.PID == 0) {
		return PrinterRef{}, errors.New("usb ref missing vid/pid")
	}
	return ref, nil
}

func PrinterFromRef(ref PrinterRef) Printer {
	stable := StableIDFromRef(ref)
	id := stable
	if id == "" {
		id = EncodePrinterRef(ref)
	}
	p := Printer{
		ID:        id,
		StableID:  stable,
		Transport: ref.Transport,
		Labels:    map[string]string{},
	}
	if ref.Transport == "network" && ref.Network != nil {
		p.Network = ref.Network
		p.Labels["ip"] = ref.Network.IP
		p.Labels["port"] = strconv.Itoa(ref.Network.Port)
		if ref.Network.MAC != "" {
			p.Labels["mac"] = ref.Network.MAC
		}
	}
	if ref.Transport == "usb" && ref.USB != nil {
		p.USB = ref.USB
		p.Labels["vid"] = "0x" + strconv.FormatUint(uint64(ref.USB.VID), 16)
		p.Labels["pid"] = "0x" + strconv.FormatUint(uint64(ref.USB.PID), 16)
		if ref.USB.Serial != "" {
			p.Labels["serial"] = ref.USB.Serial
		}
	}
	return p
}

func StableIDFromRef(ref PrinterRef) string {
	key := stableKey(ref)
	if key == "" {
		return ""
	}
	sum := sha256.Sum256([]byte(key))
	return hex.EncodeToString(sum[:])
}

func stableKey(ref PrinterRef) string {
	switch ref.Transport {
	case "network":
		if ref.Network == nil {
			return ""
		}
		base := "net:"
		if ref.Network.MAC != "" {
			return fmt.Sprintf("%s%s:%d", base, ref.Network.MAC, ref.Network.Port)
		}
		if ref.Network.IP != "" && ref.Network.Port != 0 {
			return fmt.Sprintf("%s%s:%d", base, ref.Network.IP, ref.Network.Port)
		}
	case "usb":
		if ref.USB == nil {
			return ""
		}
		if ref.USB.Serial != "" {
			return fmt.Sprintf("usb:%04x:%04x:%s", ref.USB.VID, ref.USB.PID, ref.USB.Serial)
		}
		if ref.USB.Manufacturer != "" || ref.USB.Product != "" {
			return fmt.Sprintf("usb:%04x:%04x:%s:%s", ref.USB.VID, ref.USB.PID, ref.USB.Manufacturer, ref.USB.Product)
		}
		return fmt.Sprintf("usb:%04x:%04x", ref.USB.VID, ref.USB.PID)
	}
	return ""
}
