package qlog

import "context"

type ctxKey int

const (
	loggerKey ctxKey = iota
	requestIDKey
)

func WithLogger(ctx context.Context, logger Logger) context.Context {
	return context.WithValue(ctx, loggerKey, logger)
}

func FromContext(ctx context.Context, fallback Logger) Logger {
	if v := ctx.Value(loggerKey); v != nil {
		if l, ok := v.(Logger); ok {
			return l
		}
	}
	if fallback != nil {
		return fallback
	}
	return NewNopLogger()
}

func WithRequestID(ctx context.Context, requestID string) context.Context {
	return context.WithValue(ctx, requestIDKey, requestID)
}

func RequestIDFromContext(ctx context.Context) (string, bool) {
	if v := ctx.Value(requestIDKey); v != nil {
		if s, ok := v.(string); ok {
			return s, true
		}
	}
	return "", false
}
