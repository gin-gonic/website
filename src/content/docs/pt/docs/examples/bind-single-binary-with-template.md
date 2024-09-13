---
title: "Construir um único binário com modelos de marcação"

---
## Usar o pacote de terceiro

Tu podes usar o pacote de terceiro para construir um servidor em um único binário contendo os modelos de marcação usando o [go-assets](https://github.com/jessevdk/go-assets):

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

// loadTemplate carrega os modelos de marcação fixado pelo go-assets-builder
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

Consulte um exemplo completo no diretório [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01).
