---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON` protects against a class of vulnerability known as **JSON hijacking**. In older browsers (primarily Internet Explorer 9 and earlier), a malicious page could include a `<script>` tag pointing to a victim's JSON API endpoint. If that endpoint returned a top-level JSON array (e.g., `["secret","data"]`), the browser would execute it as JavaScript. By overriding the `Array` constructor, the attacker could intercept the parsed values and leak sensitive data to a third-party server.

**How SecureJSON prevents this:**

When the response data is a JSON array, `SecureJSON` prepends an unparseable prefix — by default `while(1);` — to the response body. This causes the browser's JavaScript engine to enter an infinite loop if the response is loaded via a `<script>` tag, preventing the data from being accessed. Legitimate API consumers (using `fetch`, `XMLHttpRequest`, or any HTTP client) read the raw response body and can simply strip the prefix before parsing.

Google's APIs use a similar technique with `)]}'\n`, and Facebook uses `for(;;);`. You can customize the prefix with `router.SecureJsonPrefix()`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // You can also use your own secure json prefix
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // Will output  :   while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
Modern browsers have fixed this vulnerability, so `SecureJSON` is primarily relevant if you need to support legacy browsers or if your security policy requires defense-in-depth. For most new APIs, standard `c.JSON()` is sufficient.
:::
