package main

import (
	"encoding/json"
	"fmt"
	"github.com/zipkero/finder-api/finder"
	"github.com/zipkero/finder-api/swa"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
)

func main() {
	port := 8080
	if len(os.Args) > 1 {
		port, _ = strconv.Atoi(os.Args[1])
	}
	//dir := `D:\ecsolution\Master\80 Contents\WebResource\Contents\js`

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Join(filepath.Dir(filename), "pages")

	webApplication := swa.NewSimpleWebApplication(port)
	webApplication.HandleFunc("POST", "/search", func(res http.ResponseWriter, req *http.Request) {
		var params map[string][]string
		if err := json.NewDecoder(req.Body).Decode(&params); err != nil {
			fmt.Println("json decoding error: ", err)
			return
		}
		words := params["words"]
		finderApp := finder.NewFinder(words)

		files := finderApp.FindFiles(dir)

		if err := json.NewEncoder(res).Encode(files); err != nil {
			fmt.Println(err)
		}
	})
	webApplication.Run()
}
