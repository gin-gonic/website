---
title: "Şablonlarla tekli ikili oluşturma"
sidebar:
  order: 11
---
## `//go:embed` kullanımı (önerilen)

Go 1.16'dan itibaren standart kütüphane, `//go:embed` yönergesi ile dosyaları doğrudan ikili dosyaya gömmeyi destekler. Üçüncü taraf bağımlılığa gerek yoktur.

```go
package main

import (
  "embed"
  "html/template"
  "net/http"

  "github.com/gin-gonic/gin"
)

//go:embed templates/*
var templateFS embed.FS

func main() {
  router := gin.Default()

  t := template.Must(template.ParseFS(templateFS, "templates/*.tmpl"))
  router.SetHTMLTemplate(t)

  router.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "index.tmpl", nil)
  })

  router.Run(":8080")
}
```

## Üçüncü taraf paket kullanımı

Şablonları ikili dosyaya gömmek için [go-assets](https://github.com/jessevdk/go-assets) gibi üçüncü taraf paketler de kullanabilirsiniz.

```go
func main() {
  router := gin.New()

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

// loadTemplate loads templates embedded by go-assets-builder
func loadTemplate() (*template.Template, error) {
  t := template.New("")
  for name, file := range Assets.Files {
    if file.IsDir() || !strings.HasSuffix(name, ".tmpl") {
      continue
    }
    h, err := io.ReadAll(file)
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

Tam bir örnek için [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01) dizinine bakın.
