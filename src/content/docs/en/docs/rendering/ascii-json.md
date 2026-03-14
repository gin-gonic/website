---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON` serializes data to JSON but escapes all non-ASCII characters into `\uXXXX` Unicode escape sequences. HTML-special characters like `<` and `>` are also escaped. The result is a response body that contains only 7-bit ASCII characters.

**When to use AsciiJSON:**

- Your API consumers require strictly ASCII-safe responses (for example, systems that cannot handle UTF-8 encoded bytes).
- You need to embed JSON inside contexts that only support ASCII, such as certain logging systems or legacy transports.
- You want to ensure that characters like `<`, `>`, and `&` are escaped to avoid injection issues when JSON is embedded in HTML.

For most modern APIs, standard `c.JSON()` is sufficient since it outputs valid UTF-8. Use `AsciiJSON` only when ASCII safety is a specific requirement.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/someJSON", func(c *gin.Context) {
    data := map[string]interface{}{
      "lang": "GO语言",
      "tag":  "<br>",
    }

    // will output : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

You can test this endpoint with curl:

```bash
curl http://localhost:8080/someJSON
# Output: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

Notice that the Chinese characters `语言` are replaced with `\u8bed\u8a00`, and the `<br>` tag becomes `\u003cbr\u003e`. The response body is safe to consume in any ASCII-only environment.
