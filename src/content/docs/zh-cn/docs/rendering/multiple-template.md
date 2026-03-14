---
title: "多模板"
sidebar:
  order: 10
---

Gin 默认只允许使用一个 `html.Template`。查看 [multitemplate](https://github.com/gin-contrib/multitemplate) 以使用 `block template` 等功能。

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
