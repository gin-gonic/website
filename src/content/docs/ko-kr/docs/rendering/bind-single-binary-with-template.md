---
title: "템플릿과 함께 단일 바이너리 빌드"
sidebar:
  order: 11
---
## `//go:embed` 사용 (권장)

Go 1.16부터 표준 라이브러리는 `//go:embed` 지시문으로 파일을 바이너리에 직접 임베드하는 것을 지원합니다. 타사 의존성이 필요 없습니다.

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

## 타사 패키지 사용

[go-assets](https://github.com/jessevdk/go-assets)와 같은 타사 패키지를 사용하여 템플릿을 바이너리에 임베드할 수도 있습니다.

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

// loadTemplate은 go-assets-builder로 임베드된 템플릿을 로드합니다
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

완전한 예제는 [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01) 디렉토리에서 확인하세요.
