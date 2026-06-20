---
title: "テンプレートを含む単一バイナリのビルド"
sidebar:
  order: 11
---
## `//go:embed`の使用（推奨）

Go 1.16以降、標準ライブラリは`//go:embed`ディレクティブでファイルをバイナリに直接埋め込むことをサポートしています。サードパーティの依存関係は不要です。

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

## サードパーティパッケージの使用

[go-assets](https://github.com/jessevdk/go-assets)などのサードパーティパッケージを使用してテンプレートをバイナリに埋め込むこともできます。

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

// loadTemplateはgo-assets-builderで埋め込まれたテンプレートを読み込みます
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

完全な例は[assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01)ディレクトリをご覧ください。
