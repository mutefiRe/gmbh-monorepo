package escpos

import "testing"

func TestBuildPrintPayloadText(t *testing.T) {
	req := PrintRequest{
		Text: &TextPrint{Lines: []string{"Hello", "World"}, Bold: true},
		Cut:  true,
		Feed: 2,
	}
	payload, err := BuildPrintPayload(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(payload) == 0 {
		t.Fatal("expected payload to be non-empty")
	}
}

func TestBuildPrintPayloadRawBase64MissingText(t *testing.T) {
	_, err := BuildPrintPayload(PrintRequest{})
	if err == nil {
		t.Fatal("expected error for missing text or rawBase64")
	}
}
