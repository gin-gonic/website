---
title: "静态资源嵌入"
draft: false
---

你可以使用  [go-assets](https://github.com/jessevdk/go-assets) 将静态资源打包到可执行文件中。

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

// loadTemplate 加载由 go-assets-builder 嵌入的模板
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

请参阅 [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01) 目录中的完整示例。
