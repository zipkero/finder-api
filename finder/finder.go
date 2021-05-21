package finder

import (
	"bufio"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

type LineInfo struct {
	LineNo int    `json:"lineno"`
	Line   string `json:"line"`
}

type FindInfo struct {
	Filename string         `json:"filename"`
	Lines    []LineInfo     `json:"lines"`
	WordMap  map[string]int `json:"words"`
}

type Finder struct {
	dir string
}

func NewFinder(dir string) *Finder {
	return &Finder{dir: dir}
}

func (f *Finder) FindFiles(words []string) []*FindInfo {
	runtime.GOMAXPROCS(runtime.NumCPU())

	ch := make(chan *FindInfo)

	cnt := 0
	err := filepath.Walk(f.dir, func(path string, info fs.FileInfo, err error) error {
		if info.IsDir() {
			return nil
		}

		go f.findWordInFiles(info.Name(), path, words, ch)

		cnt += 1
		return nil
	})

	if err != nil {
		fmt.Println(err)
	}

	recvCnt := 0
	var findInfos []*FindInfo
	for findInfo := range ch {
		if findInfo != nil {
			findInfos = append(findInfos, findInfo)
		}
		recvCnt += 1
		if recvCnt == cnt {
			break
		}
	}
	return findInfos
}

func (f *Finder) findWordInFiles(filename, path string, words []string, cb chan *FindInfo) {
	findInfo := &FindInfo{Filename: filename, Lines: []LineInfo{}, WordMap: make(map[string]int)}
	file, err := os.Open(path)
	if err != nil {
		fmt.Println("no files : ", filename)
		cb <- nil
		return
	}
	defer file.Close()

	lineNo := 1
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()
		if len(words) > 0 {
			isLineContains := false
			for _, word := range words {
				if strings.Contains(line, word) {
					isLineContains = true
					if _, exists := findInfo.WordMap[word]; !exists {
						findInfo.WordMap[word] = 0
					}
					findInfo.WordMap[word] = findInfo.WordMap[word] + 1
				}
			}

			if isLineContains {
				findInfo.Lines = append(findInfo.Lines, LineInfo{lineNo, line})
			}
		}
		lineNo++
	}

	if len(findInfo.Lines) > 0 {
		cb <- findInfo
	} else {
		cb <- nil
	}
}
