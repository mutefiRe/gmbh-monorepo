package transport

import (
	"sync"
	"time"

	"escpos-service/internal/model"
)

type throttleState struct {
	mu       sync.Mutex
	delay    time.Duration
	lastSent map[string]time.Time
}

var throttle = &throttleState{lastSent: make(map[string]time.Time)}

func ConfigureThrottle(delay time.Duration) {
	throttle.mu.Lock()
	defer throttle.mu.Unlock()
	throttle.delay = delay
	if throttle.lastSent == nil {
		throttle.lastSent = make(map[string]time.Time)
	}
}

func applyThrottle(ref model.PrinterRef) {
	throttle.mu.Lock()
	delay := throttle.delay
	if delay <= 0 {
		throttle.mu.Unlock()
		return
	}

	key := printerKey(ref)
	now := time.Now()
	next := throttle.lastSent[key].Add(delay)
	wait := next.Sub(now)
	if wait < 0 {
		wait = 0
	}
	throttle.lastSent[key] = now.Add(wait)
	throttle.mu.Unlock()

	if wait > 0 {
		time.Sleep(wait)
	}
}

func printerKey(ref model.PrinterRef) string {
	if stable := model.StableIDFromRef(ref); stable != "" {
		return stable
	}
	return model.EncodePrinterRef(ref)
}
