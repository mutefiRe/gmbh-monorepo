package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"escpos-service/internal/api"
	"escpos-service/internal/config"
	"escpos-service/internal/qlog"
	"escpos-service/internal/transport"
)

func main() {
	cfg := config.ConfigFromEnv()
	transport.ConfigureThrottle(cfg.PrintThrottle)
	transport.ConfigureQueue(cfg.PrintQueueSize)
	logger, err := qlog.NewLogger()
	if err != nil {
		panic(err)
	}
	defer logger.Sync()

	r := api.NewRouter(cfg, logger)

	srv := &http.Server{
		Addr:              cfg.ListenAddr,
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		logger.Info("escpos-service listening", qlog.String("addr", cfg.ListenAddr))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("listen failed", qlog.Error(err))
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctx)
}
