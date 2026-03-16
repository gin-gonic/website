---
title: "查询字符串参数"
sidebar:
  order: 3
---

查询字符串参数是出现在 URL 中 `?` 后面的键值对（例如 `/search?q=gin&page=2`）。Gin 提供了两种方法来读取它们：

- `c.Query("key")` 返回查询参数的值，如果键不存在则返回**空字符串**。
- `c.DefaultQuery("key", "default")` 返回值，如果键不存在则返回指定的**默认值**。

这两种方法都是访问 `c.Request.URL.Query()` 的便捷方式，减少了样板代码。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Query string parameters are parsed using the existing underlying request object.
  // The request responds to a url matching:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // shortcut for c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

## 测试

```sh
# Both parameters provided
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# Output: Hello Jane Doe

# Missing firstname -- uses default value "Guest"
curl "http://localhost:8080/welcome?lastname=Doe"
# Output: Hello Guest Doe

# No parameters at all
curl "http://localhost:8080/welcome"
# Output: Hello Guest
```

## 另请参阅

- [路径参数](/zh-cn/docs/routing/param-in-path/)
