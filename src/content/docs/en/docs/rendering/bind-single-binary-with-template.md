---
title: "Build a single binary with templates"
sidebar:
  order: 11
---
## Using `//go:embed` (recommended)

Since Go 1.16, the standard library supports embedding files directly into the binary with the `//go:embed` directive. No third-party dependencies are needed.

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

## Using a third-party package

You can also use a third-party package such as [go-assets](https://github.com/jessevdk/go-assets) to embed templates into the binary.

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

See a complete example in the [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01) directory.
