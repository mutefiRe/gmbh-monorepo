package escpos

import (
	"encoding/base64"
	"errors"
)

type PrintRequest struct {
	Text      *TextPrint `json:"text,omitempty"`
	RawBase64 string     `json:"rawBase64,omitempty"`
	Cut       bool       `json:"cut,omitempty"`
	Feed      int        `json:"feed,omitempty"`
	Drawer    bool       `json:"drawer,omitempty"`
}

type TextPrint struct {
	Lines   []string `json:"lines"`
	Center  bool     `json:"center,omitempty"`
	Bold    bool     `json:"bold,omitempty"`
	DoubleW bool     `json:"doubleW,omitempty"`
	DoubleH bool     `json:"doubleH,omitempty"`
}

func BuildPrintPayload(req PrintRequest) ([]byte, error) {
	if req.RawBase64 != "" {
		b, err := base64.StdEncoding.DecodeString(req.RawBase64)
		if err != nil {
			return nil, err
		}
		return b, nil
	}
	if req.Text == nil {
		return nil, errors.New("either text or rawBase64 must be provided")
	}

	var out []byte
	out = append(out, escInit()...)

	if req.Text.Center {
		out = append(out, escAlignCenter()...)
	} else {
		out = append(out, escAlignLeft()...)
	}
	if req.Text.Bold {
		out = append(out, escBoldOn()...)
	} else {
		out = append(out, escBoldOff()...)
	}

	out = append(out, gsSetSize(req.Text.DoubleW, req.Text.DoubleH)...)

	for _, line := range req.Text.Lines {
		out = append(out, []byte(line)...)
		out = append(out, '\n')
	}

	out = append(out, gsSetSize(false, false)...)
	out = append(out, escBoldOff()...)
	out = append(out, escAlignLeft()...)

	if req.Feed > 0 {
		out = append(out, escFeedLines(req.Feed)...)
	}
	if req.Drawer {
		out = append(out, escKickDrawerPin2()...)
	}
	if req.Cut {
		out = append(out, gsCutPartial()...)
	}
	return out, nil
}

func escInit() []byte           { return []byte{0x1b, 0x40} }
func escAlignLeft() []byte      { return []byte{0x1b, 0x61, 0x00} }
func escAlignCenter() []byte    { return []byte{0x1b, 0x61, 0x01} }
func escBoldOn() []byte         { return []byte{0x1b, 0x45, 0x01} }
func escBoldOff() []byte        { return []byte{0x1b, 0x45, 0x00} }
func escFeedLines(n int) []byte { return []byte{0x1b, 0x64, byte(n)} }
func gsCutPartial() []byte      { return []byte{0x1d, 0x56, 0x01} }
func escKickDrawerPin2() []byte { return []byte{0x1b, 0x70, 0x00, 0x32, 0x32} }
func gsSetSize(doubleW, doubleH bool) []byte {
	var n byte = 0x00
	if doubleW {
		n |= 0x10
	}
	if doubleH {
		n |= 0x01
	}
	return []byte{0x1d, 0x21, n}
}
