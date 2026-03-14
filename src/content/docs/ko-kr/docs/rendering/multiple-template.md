---
title: "다중 템플릿"
sidebar:
  order: 10
---

Gin은 기본적으로 하나의 `html.Template`만 허용합니다. `block template` 같은 기능을 사용하려면 [multitemplate](https://github.com/gin-contrib/multitemplate)를 확인하세요.

```go
package main

import (
  "github.com/gin-contrib/multitemplate"
  "github.com/gin-gonic/gin"
)

func createMyRender() multitemplate.Renderer {
  r := multitemplate.NewRenderer()
  r.AddFromFiles("index", "templates/base.html", "templates/index.html")
  r.AddFromFiles("article", "templates/base.html", "templates/article.html")
  return r
}

func main() {
  router := gin.Default()
  router.HTMLRender = createMyRender()

  router.GET("/", func(c *gin.Context) {
    c.HTML(200, "index", gin.H{"title": "Home"})
  })
  router.GET("/article", func(c *gin.Context) {
    c.HTML(200, "article", gin.H{"title": "Article"})
  })

  router.Run(":8080")
}
```
