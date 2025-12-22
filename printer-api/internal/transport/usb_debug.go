//go:build (linux || darwin) && cgo

package transport

import (
	"fmt"
	"strings"

	"github.com/google/gousb"
)

func debugUSBDevice(dev *gousb.Device) string {
	var b strings.Builder
	fmt.Fprintf(&b, "device vid=0x%04x pid=0x%04x\n", uint16(dev.Desc.Vendor), uint16(dev.Desc.Product))
	for _, cfg := range dev.Desc.Configs {
		fmt.Fprintf(&b, "  config %d\n", cfg.Number)
		for _, intf := range cfg.Interfaces {
			for _, alt := range intf.AltSettings {
				fmt.Fprintf(&b, "    interface %d alt %d class=0x%02x (%v)\n", intf.Number, alt.Number, uint8(alt.Class), alt.Class)
				for _, ep := range alt.Endpoints {
					fmt.Fprintf(&b, "      endpoint %d dir=%v transfer=%v\n", ep.Number, ep.Direction, ep.TransferType)
				}
			}
		}
	}
	return b.String()
}
