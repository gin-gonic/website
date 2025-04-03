---
title: "Создание единого бинарного файла с помощью шаблонов"

---
## Использование стороннего пакета

Вы можете использовать сторонний пакет для сборки сервера в единый бинарник, содержащий шаблоны, используя [go-assets](https://github.com/jessevdk/go-assets).

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

// loadTemplate loads templates embedded by go-assets-builder
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

Полный пример находится в каталоге [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01).
