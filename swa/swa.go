package swa

import (
	"fmt"
	"net/http"
)

type swa struct {
	port   int
	router *router
}

func NewSimpleWebApplication(port int) *swa {
	return &swa{port: port, router: &router{
		handlers: make(map[string]map[string]http.HandlerFunc),
	}}
}

func (s *swa) HandleFunc(method, pattern string, handler http.HandlerFunc) {
	m, ok := s.router.handlers[method]
	if !ok {
		m = make(map[string]http.HandlerFunc)
		s.router.handlers[method] = m
	}
	m[pattern] = handler
}

func (s *swa) Run() {
	port := fmt.Sprintf(":%d", s.port)
	if err := http.ListenAndServe(port, s.router); err != nil {
		panic(err)
	}
}
