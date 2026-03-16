---
title: "PureJSON"
sidebar:
  order: 5
---

Normally, Go's `json.Marshal` replaces special HTML characters with unicode escape sequences for safety — for example, `<` becomes `\u003c`. This is fine when embedding JSON in HTML, but if you are building a pure API, clients may expect the literal characters.

`c.PureJSON` uses `json.Encoder` with `SetEscapeHTML(false)`, so HTML characters like `<`, `>`, and `&` are rendered literally instead of being escaped.

Use `PureJSON` when your API consumers expect raw, unescaped JSON. Use the standard `JSON` when the response might be embedded in an HTML page.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Standard JSON -- escapes HTML characters
  router.GET("/json", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSON -- serves literal characters
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  router.Run(":8080")
}
```

## Test it

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Gin also provides `c.AbortWithStatusPureJSON` (v1.11+) for returning unescaped JSON while aborting the middleware chain — useful in authentication or validation middleware.
:::

## See also

- [AsciiJSON](/en/docs/rendering/ascii-json/)
- [SecureJSON](/en/docs/rendering/secure-json/)
- [Rendering](/en/docs/rendering/rendering/)
