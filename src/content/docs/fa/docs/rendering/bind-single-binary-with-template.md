---
title: "ساخت باینری واحد با قالب‌ها"
sidebar:
  order: 11
---
## استفاده از `//go:embed` (توصیه شده)

از Go 1.16، کتابخانه استاندارد از جاگذاری فایل‌ها مستقیماً در باینری با دستورالعمل `//go:embed` پشتیبانی می‌کند. نیازی به وابستگی‌های شخص ثالث نیست.

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

## استفاده از پکیج شخص ثالث

همچنین می‌توانید از یک پکیج شخص ثالث مانند [go-assets](https://github.com/jessevdk/go-assets) برای جاگذاری قالب‌ها در باینری استفاده کنید.

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

یک مثال کامل در دایرکتوری [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01) ببینید.
