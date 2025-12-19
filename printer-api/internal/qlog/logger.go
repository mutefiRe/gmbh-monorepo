package qlog

import (
	"errors"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Logger interface {
	With(fields ...Field) Logger
	Info(msg string, fields ...Field)
	Warn(msg string, fields ...Field)
	Error(msg string, fields ...Field)
	Fatal(msg string, fields ...Field)
	Sync() error
}

type Field struct {
	key   string
	kind  fieldKind
	value any
}

type fieldKind uint8

const (
	fieldString fieldKind = iota + 1
	fieldInt
	fieldDuration
	fieldError
)

func String(key, value string) Field {
	return Field{key: key, kind: fieldString, value: value}
}

func Int(key string, value int) Field {
	return Field{key: key, kind: fieldInt, value: value}
}

func Duration(key string, value time.Duration) Field {
	return Field{key: key, kind: fieldDuration, value: value}
}

func Error(err error) Field {
	return Field{key: "error", kind: fieldError, value: err}
}

type zapLogger struct {
	l *zap.Logger
}

func NewLogger() (Logger, error) {
	cfg := zap.NewProductionConfig()
	cfg.EncoderConfig.TimeKey = "timestamp"
	cfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	l, err := cfg.Build()
	if err != nil {
		return nil, err
	}
	return &zapLogger{l: l}, nil
}

func NewNopLogger() Logger {
	return &zapLogger{l: zap.NewNop()}
}

func (z *zapLogger) With(fields ...Field) Logger {
	return &zapLogger{l: z.l.With(toZapFields(fields...)...)}
}

func (z *zapLogger) Info(msg string, fields ...Field) {
	z.l.Info(msg, toZapFields(fields...)...)
}

func (z *zapLogger) Warn(msg string, fields ...Field) {
	z.l.Warn(msg, toZapFields(fields...)...)
}

func (z *zapLogger) Error(msg string, fields ...Field) {
	z.l.Error(msg, toZapFields(fields...)...)
}

func (z *zapLogger) Fatal(msg string, fields ...Field) {
	z.l.Fatal(msg, toZapFields(fields...)...)
}

func (z *zapLogger) Sync() error {
	if z == nil || z.l == nil {
		return errors.New("logger not initialized")
	}
	return z.l.Sync()
}

func toZapFields(fields ...Field) []zap.Field {
	out := make([]zap.Field, 0, len(fields))
	for _, f := range fields {
		switch f.kind {
		case fieldString:
			out = append(out, zap.String(f.key, f.value.(string)))
		case fieldInt:
			out = append(out, zap.Int(f.key, f.value.(int)))
		case fieldDuration:
			out = append(out, zap.Duration(f.key, f.value.(time.Duration)))
		case fieldError:
			if err, ok := f.value.(error); ok {
				out = append(out, zap.Error(err))
			}
		}
	}
	return out
}
