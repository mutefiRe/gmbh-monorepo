//go:build (linux || darwin) && cgo

package transport

import (
	"errors"
	"fmt"
	"runtime"
	"time"

	"escpos-service/internal/model"

	"github.com/google/gousb"
)

const usbWriteTimeout = 3 * time.Second
const hopE801VID = 0x0471
const hopE801PID = 0x0055

func sendUSB(ref model.PrinterRef, payload []byte) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("usb panic: %v", r)
		}
	}()
	if ref.USB == nil {
		return errors.New("usb ref missing")
	}

	ctx, err := safeUSBContext()
	if err != nil {
		return err
	}
	defer ctx.Close()

	devs, err := ctx.OpenDevices(func(desc *gousb.DeviceDesc) bool {
		return desc.Vendor == gousb.ID(ref.USB.VID) && desc.Product == gousb.ID(ref.USB.PID)
	})
	if err != nil {
		return err
	}
	if len(devs) == 0 {
		return errors.New("usb device not found")
	}
	defer func() {
		for _, d := range devs {
			d.Close()
		}
	}()

	var lastErr error
	for _, dev := range devs {
		if runtime.GOOS == "linux" {
			_ = dev.SetAutoDetach(true)
		}
		if ref.USB.Serial != "" {
			serial, _ := dev.SerialNumber()
			if serial != ref.USB.Serial {
				continue
			}
		}

		if err := tryPrintDevice(dev, payload); err == nil {
			return nil
		} else {
			lastErr = err
		}
	}

	if lastErr == nil {
		lastErr = errors.New("usb printer interface not found")
	}
	if ref.USB.Serial != "" {
		for _, dev := range devs {
			serial, _ := dev.SerialNumber()
			if serial != ref.USB.Serial {
				continue
			}
			return fmt.Errorf("usb print failed: %v. debug:\n%s", lastErr, debugUSBDevice(dev))
		}
	}
	return fmt.Errorf("usb print failed: %v. debug:\n%s", lastErr, debugUSBDevice(devs[0]))
}

func safeUSBContext() (_ *gousb.Context, err error) {
	var lastErr error
	for i := 0; i < 2; i++ {
		ctx, initErr := tryUSBContext()
		if initErr == nil {
			return ctx, nil
		}
		lastErr = initErr
		time.Sleep(150 * time.Millisecond)
	}
	return nil, lastErr
}

func tryUSBContext() (_ *gousb.Context, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("usb init failed: %v", r)
		}
	}()
	return gousb.NewContext(), nil
}

func tryPrintDevice(dev *gousb.Device, payload []byte) error {
	isHopE801 := dev.Desc.Vendor == gousb.ID(hopE801VID) && dev.Desc.Product == gousb.ID(hopE801PID)
	var lastErr error
	for _, cfg := range dev.Desc.Configs {
		c, err := dev.Config(cfg.Number)
		if err != nil {
			lastErr = err
			continue
		}
		success := false
		func() {
			defer c.Close()
			for _, intf := range cfg.Interfaces {
				for _, alt := range intf.AltSettings {
					if !isHopE801 && alt.Class != gousb.ClassPrinter && alt.Class != gousb.ClassVendorSpec {
						continue
					}
					intfH, err := c.Interface(intf.Number, alt.Number)
					if err != nil {
						lastErr = err
						continue
					}
					func() {
						defer intfH.Close()
						for _, ep := range alt.Endpoints {
							if ep.Direction != gousb.EndpointDirectionOut {
								continue
							}
							if !isHopE801 && ep.TransferType != gousb.TransferTypeBulk {
								continue
							}
							out, err := intfH.OutEndpoint(ep.Number)
							if err != nil {
								lastErr = err
								continue
							}
							if err := writeAllWithTimeout(out, payload, usbWriteTimeout); err == nil {
								success = true
								return
							} else {
								lastErr = err
							}
						}
					}()
					if success {
						return
					}
				}
				if success {
					return
				}
			}
		}()
		if success {
			return nil
		}
	}
	if lastErr != nil {
		return lastErr
	}
	return fmt.Errorf("no writable USB endpoint")
}

func writeAllWithTimeout(out *gousb.OutEndpoint, payload []byte, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	remaining := payload
	for len(remaining) > 0 {
		if time.Now().After(deadline) {
			return errors.New("usb write timeout")
		}
		n, err := out.Write(remaining)
		if err != nil {
			return err
		}
		remaining = remaining[n:]
	}
	return nil
}
