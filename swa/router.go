package swa

import (
	"net/http"
)

type router struct {
	handlers map[string]map[string]http.HandlerFunc
}

func (r *router) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	m, err := r.handlers[req.Method]
	if !err {
		http.NotFound(res, req)
		return
	}
	h, err := m[req.URL.Path]
	if !err {
		http.NotFound(res, req)
		return
	}
	h(res, req)
}
