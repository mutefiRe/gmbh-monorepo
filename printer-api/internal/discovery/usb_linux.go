//go:build linux

package discovery

import (
	"strings"

	"escpos-service/internal/model"

	"github.com/google/gousb"
)

func DiscoverUSBPrinters() ([]model.PrinterRef, error) {
	ctx := gousb.NewContext()
	defer ctx.Close()

	var out []model.PrinterRef

	devs, err := ctx.OpenDevices(func(desc *gousb.DeviceDesc) bool { return true })
	if err != nil {
		// still proceed with whatever opened
	}

	for _, dev := range devs {
		func() {
			defer dev.Close()

			dd := dev.Desc
			isPrinter := false
			for _, cfg := range dd.Configs {
				for _, intf := range cfg.Interfaces {
					for _, alt := range intf.AltSettings {
						if alt.Class == gousb.ClassPrinter {
							isPrinter = true
						}
					}
				}
			}

			man, _ := dev.Manufacturer()
			prod, _ := dev.Product()
			serial, _ := dev.SerialNumber()

			s := strings.ToLower(man + " " + prod)
			if !isPrinter {
				if strings.Contains(s, "printer") || strings.Contains(s, "pos") ||
					strings.Contains(s, "epson") || strings.Contains(s, "star") ||
					strings.Contains(s, "bixolon") || strings.Contains(s, "xprinter") ||
					strings.Contains(s, "zjiang") {
					isPrinter = true
				}
			}
			if !isPrinter {
				return
			}

			ref := model.PrinterRef{Transport: "usb", USB: &model.USBRef{VID: uint16(dd.Vendor), PID: uint16(dd.Product), Serial: serial, Manufacturer: man, Product: prod}}
			out = append(out, ref)
		}()
	}

	return out, nil
}
