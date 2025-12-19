package transport

import (
	"errors"
	"sync"
	"time"

	"escpos-service/internal/model"
)

const defaultQueueSize = 100

var retryBackoff = []time.Duration{
	200 * time.Millisecond,
	500 * time.Millisecond,
	1 * time.Second,
}

type printJob struct {
	ref    model.PrinterRef
	data   []byte
	result chan error
}

type queueState struct {
	mu      sync.Mutex
	queues  map[string]chan printJob
	size    int
	started map[string]struct{}
}

var queues = &queueState{
	queues:  make(map[string]chan printJob),
	started: make(map[string]struct{}),
	size:    defaultQueueSize,
}

func ConfigureQueue(size int) {
	queues.mu.Lock()
	defer queues.mu.Unlock()
	if size <= 0 {
		size = defaultQueueSize
	}
	queues.size = size
}

func enqueuePrint(ref model.PrinterRef, data []byte) error {
	job := printJob{ref: ref, data: data, result: make(chan error, 1)}
	key := printerKey(ref)

	q := queues.getOrCreate(key)
	select {
	case q <- job:
		return <-job.result
	default:
		return errors.New("print queue full")
	}
}

func (s *queueState) getOrCreate(key string) chan printJob {
	s.mu.Lock()
	defer s.mu.Unlock()
	q, ok := s.queues[key]
	if !ok {
		q = make(chan printJob, s.size)
		s.queues[key] = q
	}
	if _, ok := s.started[key]; !ok {
		s.started[key] = struct{}{}
		go worker(q)
	}
	return q
}

func queueInfo(ref model.PrinterRef) (depth int, capacity int, ok bool) {
	key := printerKey(ref)
	queues.mu.Lock()
	defer queues.mu.Unlock()
	q, exists := queues.queues[key]
	if !exists {
		return 0, queues.size, false
	}
	return len(q), cap(q), true
}

func worker(q chan printJob) {
	for job := range q {
		err := sendWithRetry(job.ref, job.data)
		job.result <- err
		close(job.result)
	}
}

func sendWithRetry(ref model.PrinterRef, data []byte) error {
	var err error
	for i := 0; i <= len(retryBackoff); i++ {
		err = sendImmediate(ref, data)
		if err == nil {
			return nil
		}
		if i < len(retryBackoff) {
			time.Sleep(retryBackoff[i])
		}
	}
	return err
}

func QueueInfo(ref model.PrinterRef) (depth int, capacity int, ok bool) {
	return queueInfo(ref)
}
