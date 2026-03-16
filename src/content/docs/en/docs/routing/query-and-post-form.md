---
title: "Query and post form"
sidebar:
  order: 5
---

When handling a `POST` request, you often need to read values from both the URL query string and the request body. Gin keeps these two sources separate, so you can access each independently:

- `c.Query("key")` / `c.DefaultQuery("key", "default")` — reads from the URL query string.
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` — reads from the `application/x-www-form-urlencoded` or `multipart/form-data` request body.

This is common in REST APIs where the route identifies the resource (via query parameters like `id`) while the body carries the payload (like `name` and `message`).

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

## Test it

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
`c.Query` only reads from the URL query string, and `c.PostForm` only reads from the request body. They never cross over. If you want Gin to automatically check both sources, use `c.ShouldBind` with a struct instead.
:::

## See also

- [Query string parameters](/en/docs/routing/querystring-param/)
- [Map as querystring or postform parameters](/en/docs/routing/map-as-querystring-or-postform/)
- [Multipart/urlencoded form](/en/docs/routing/multipart-urlencoded-form/)
