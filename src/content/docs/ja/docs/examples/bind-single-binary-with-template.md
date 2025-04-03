---
title: "テンプレートを含めた1つのバイナリをビルドする"
---

[go-assets](https://github.com/jessevdk/go-assets) を利用することで、サーバーアプリケーションを、テンプレートを含む1つのバイナリにまとめることができます。

[go-assets]: https://github.com/jessevdk/go-assets

```go
func main() {
	r := gin.New()

	t, err := loadTemplate()
	if err != nil {
		panic(err)
	}
	router.SetHTMLTemplate(t)

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "/html/index.tmpl", nil)
	})
	router.Run(":8080")
}

// loadTemplate は go-assets-builder によって埋め込まれたテンプレートたちをロードします。
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

完全なサンプルコードは、[assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01) を見てください。


