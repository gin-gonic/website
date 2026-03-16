---
title: "Parameters in path"
sidebar:
  order: 2
---

Gin supports two types of path parameters that let you capture values directly from the URL:

- **`:name`** — matches a single path segment. For example, `/user/:name` matches `/user/john` but does **not** match `/user/` or `/user`.
- **`*action`** — matches everything after the prefix, including slashes. For example, `/user/:name/*action` matches `/user/john/send` and `/user/john/`. The captured value includes the leading `/`.

Use `c.Param("name")` to retrieve the value of a path parameter inside your handler.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // This handler will match /user/john but will not match /user/ or /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // However, this one will match /user/john/ and also /user/john/send
  // If no other routers match /user/john, it will redirect to /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## Test it

```sh
# Single parameter -- matches :name
curl http://localhost:8080/user/john
# Output: Hello john

# Wildcard parameter -- matches :name and *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# Trailing slash is captured by the wildcard
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
The wildcard `*action` value always includes the leading `/`. In the example above, `c.Param("action")` returns `/send`, not `send`.
:::

:::caution
You cannot define both `/user/:name` and `/user/:name/*action` if they conflict at the same path depth. Gin will panic at startup if it detects ambiguous routes.
:::

## See also

- [Query string parameters](/en/docs/routing/querystring-param/)
- [Query and post form](/en/docs/routing/query-and-post-form/)
