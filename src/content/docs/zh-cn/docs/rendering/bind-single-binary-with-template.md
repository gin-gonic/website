---
title: "将模板构建到单一二进制文件中"
sidebar:
  order: 11
---
## 使用 `//go:embed`（推荐）

自 Go 1.16 起，标准库支持使用 `//go:embed` 指令将文件直接嵌入二进制文件中。无需第三方依赖。

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

## 使用第三方包

你也可以使用第三方包如 [go-assets](https://github.com/jessevdk/go-assets) 将模板嵌入二进制文件中。

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

在 [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01) 目录中查看完整示例。
