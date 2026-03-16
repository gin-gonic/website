---
title: "查詢字串參數"
sidebar:
  order: 3
---

查詢字串參數是出現在 URL 中 `?` 之後的鍵值對（例如 `/search?q=gin&page=2`）。Gin 提供兩個方法來讀取它們：

- `c.Query("key")` 回傳查詢參數的值，如果該鍵不存在則回傳**空字串**。
- `c.DefaultQuery("key", "default")` 回傳查詢參數的值，如果該鍵不存在則回傳指定的**預設值**。

這兩個方法都是存取 `c.Request.URL.Query()` 的捷徑，減少了樣板程式碼。

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

## 測試

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

## 另請參閱

- [路徑參數](/zh-tw/docs/routing/param-in-path/)
