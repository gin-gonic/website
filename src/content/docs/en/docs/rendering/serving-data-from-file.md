---
title: "Serving data from file"
sidebar:
  order: 7
---

Use `c.File()` to serve a local file directly, or `c.FileFromFS()` to serve a file from an `http.FileSystem`.

```go
func main() {
  router := gin.Default()

  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  var fs http.FileSystem = // ...
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })
}
```
