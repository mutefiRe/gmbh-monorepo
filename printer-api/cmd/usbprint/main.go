package main

import (
	"encoding/hex"
	"flag"
	"fmt"
	"os"
	"strings"

	"escpos-service/internal/escpos"
	"escpos-service/internal/model"
	"escpos-service/internal/transport"
)

func main() {
	var (
		vidHex    = flag.String("vid", "", "USB vendor ID (hex, e.g. 0x0471)")
		pidHex    = flag.String("pid", "", "USB product ID (hex, e.g. 0x0055)")
		serial    = flag.String("serial", "", "USB serial (optional)")
		text      = flag.String("text", "TEST", "Text to print")
		cut       = flag.Bool("cut", true, "Cut after print")
		center    = flag.Bool("center", true, "Center text")
		bold      = flag.Bool("bold", true, "Bold text")
		feedLines = flag.Int("feed", 2, "Feed lines after print")
	)
	flag.Parse()

	vid, err := parseHexUint16(*vidHex)
	if err != nil {
		fatal(err)
	}
	pid, err := parseHexUint16(*pidHex)
	if err != nil {
		fatal(err)
	}

	ref := model.PrinterRef{
		Transport: "usb",
		USB: &model.USBRef{
			VID:    vid,
			PID:    pid,
			Serial: *serial,
		},
	}

	payload, err := escpos.BuildPrintPayload(escpos.PrintRequest{
		Text: &escpos.TextPrint{
			Lines:  []string{*text},
			Center: *center,
			Bold:   *bold,
		},
		Cut:  *cut,
		Feed: *feedLines,
	})
	if err != nil {
		fatal(err)
	}

	if err := transport.Send(ref, payload); err != nil {
		fatal(err)
	}

	fmt.Println("print sent")
}

func parseHexUint16(raw string) (uint16, error) {
	if raw == "" {
		return 0, fmt.Errorf("missing hex value")
	}
	clean := strings.TrimPrefix(strings.ToLower(raw), "0x")
	b, err := hex.DecodeString(clean)
	if err != nil {
		return 0, fmt.Errorf("invalid hex value: %w", err)
	}
	if len(b) > 2 {
		return 0, fmt.Errorf("hex value too large")
	}
	var v uint16
	for _, by := range b {
		v = v<<8 + uint16(by)
	}
	return v, nil
}

func fatal(err error) {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(1)
}
