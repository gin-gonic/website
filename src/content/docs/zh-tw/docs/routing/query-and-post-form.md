---
title: "查詢與 POST 表單"
sidebar:
  order: 5
---

處理 `POST` 請求時，你經常需要同時從 URL 查詢字串和請求主體讀取值。Gin 將這兩個來源分開，讓你可以獨立存取每個來源：

- `c.Query("key")` / `c.DefaultQuery("key", "default")` —— 從 URL 查詢字串讀取。
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` —— 從 `application/x-www-form-urlencoded` 或 `multipart/form-data` 請求主體讀取。

這在 REST API 中很常見，路由透過查詢參數（如 `id`）識別資源，而主體則攜帶有效負載（如 `name` 和 `message`）。

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    id := c.Query("id")
    page := c.DefaultQuery("page", "0")
    name := c.PostForm("name")
    message := c.PostForm("message")

    fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)
    c.String(http.StatusOK, "id: %s; page: %s; name: %s; message: %s", id, page, name, message)
  })

  router.Run(":8080")
}
```

## 測試

```sh
# Query params in URL, form data in body
curl -X POST "http://localhost:8080/post?id=1234&page=1" \
  -d "name=manu&message=this_is_great"
# Output: id: 1234; page: 1; name: manu; message: this_is_great

# Missing page -- falls back to default value "0"
curl -X POST "http://localhost:8080/post?id=1234" \
  -d "name=manu&message=hello"
# Output: id: 1234; page: 0; name: manu; message: hello
```

:::note
`c.Query` 只從 URL 查詢字串讀取，`c.PostForm` 只從請求主體讀取。它們永遠不會交叉讀取。如果你希望 Gin 自動檢查兩個來源，請改用帶有結構體的 `c.ShouldBind`。
:::

## 另請參閱

- [查詢字串參數](/zh-tw/docs/routing/querystring-param/)
- [Map 作為查詢字串或 POST 表單參數](/zh-tw/docs/routing/map-as-querystring-or-postform/)
- [Multipart/Urlencoded 表單](/zh-tw/docs/routing/multipart-urlencoded-form/)
