---
title: "템플릿을 포함한 단일 바이너리 빌드"
draft: false
---

[go-assets](https://github.com/jessevdk/go-assets)를 사용하여 템플릿을 포함한 단일 바이너리로 서버를 만들 수 있습니다.

```go
func main() {
	r := gin.New()

	t, err := loadTemplate()
	if err != nil {
		panic(err)
	}
	r.SetHTMLTemplate(t)

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "/html/index.tmpl", nil)
	})
	r.Run(":8080")
}

// loadTemplate은 go-assets-builder에 의해 임베디드 된 템플릿을 로드합니다
func loadTemplate() (*template.Template, error) {
	t := template.New("")
	for name, file := range Assets.Files {
		if file.IsDir() || !strings.HasSuffix(name, ".tmpl") {
			continue
		}
		h, err := ioutil.ReadAll(file)
		if err != nil {
			return nil, err
		}
		t, err = t.New(name).Parse(string(h))
		if err != nil {
			return nil, err
		}
	}
	return t, nil
}
```

전체 예제는 `https://github.com/gin-gonic/examples/tree/master/assets-in-binary` 디렉토리에서 확인하세요.

