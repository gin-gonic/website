---
title: "Bind header"
sidebar:
  order: 9
---

`ShouldBindHeader` binds HTTP request headers directly into a struct using `header` struct tags. This is useful for extracting metadata like API rate limits, authentication tokens, or custom domain headers from incoming requests.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type testHeader struct {
  Rate   int    `header:"Rate"`
  Domain string `header:"Domain"`
}

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    h := testHeader{}

    if err := c.ShouldBindHeader(&h); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run(":8080")
}
```

## Test it

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
Header names are case-insensitive per the HTTP specification. The `header` struct tag value is matched case-insensitively, so `header:"Rate"` will match headers sent as `Rate`, `rate`, or `RATE`.
:::

:::tip
You can combine `header` tags with `binding:"required"` to reject requests that are missing required headers:

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## See also

- [Binding and validation](/en/docs/binding/binding-and-validation/)
- [Bind query string or post data](/en/docs/binding/bind-query-or-post/)
