---
title: "بناء ملف ثنائي واحد مع القوالب"
sidebar:
  order: 11
---
## استخدام `//go:embed` (الطريقة الموصى بها)

منذ Go 1.16، تدعم المكتبة القياسية تضمين الملفات مباشرة في الملف الثنائي باستخدام توجيه `//go:embed`. لا حاجة لاعتمادات خارجية.

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

## استخدام حزمة طرف ثالث

يمكنك أيضاً استخدام حزمة طرف ثالث مثل [go-assets](https://github.com/jessevdk/go-assets) لتضمين القوالب في الملف الثنائي.

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

راجع مثالاً كاملاً في مجلد [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01).
