---
title: "將模板建構到單一二進位檔"
sidebar:
  order: 11
---
## 使用 `//go:embed`（推薦）

從 Go 1.16 開始，標準函式庫支援使用 `//go:embed` 指令將檔案直接嵌入二進位檔中。不需要第三方依賴。

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

## 使用第三方套件

你也可以使用第三方套件如 [go-assets](https://github.com/jessevdk/go-assets) 將模板嵌入二進位檔中。

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

請參閱 [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01) 目錄中的完整範例。
