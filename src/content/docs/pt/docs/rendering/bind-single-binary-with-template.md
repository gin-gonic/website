---
title: "Construir um binário único com templates"
sidebar:
  order: 11
---
## Usando `//go:embed` (recomendado)

Desde o Go 1.16, a biblioteca padrão suporta incorporar arquivos diretamente no binário com a diretiva `//go:embed`. Nenhuma dependência de terceiros é necessária.

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

## Usando um pacote de terceiros

Você também pode usar um pacote de terceiros como [go-assets](https://github.com/jessevdk/go-assets) para incorporar templates no binário.

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

Veja um exemplo completo no diretório [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01).
