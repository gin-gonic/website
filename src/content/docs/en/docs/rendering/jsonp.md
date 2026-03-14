---
title: "JSONP"
sidebar:
  order: 3
---

JSONP (JSON with Padding) is a technique for making cross-domain requests from browsers that predate CORS support. It works by wrapping a JSON response in a JavaScript function call. The browser loads the response via a `<script>` tag, which is not subject to the same-origin policy, and the wrapping function executes with the data as its argument.

When you call `c.JSONP()`, Gin checks for a `callback` query parameter. If present, the response body is wrapped as `callbackName({"foo":"bar"})` with a `Content-Type` of `application/javascript`. If no callback is provided, the response behaves like a standard `c.JSON()` call.

:::note
JSONP is a legacy technique. For modern applications, use [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) instead. CORS is more secure, supports all HTTP methods (not just GET), and does not require wrapping responses in callbacks. Use JSONP only when you need to support very old browsers or integrate with third-party systems that require it.
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/JSONP", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // The callback name is read from the query string, e.g.:
    // GET /JSONP?callback=x
    // Will output  :   x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

Test with curl to see the difference between JSONP and plain JSON responses:

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[Security considerations]
JSONP endpoints can be vulnerable to XSS attacks if the callback parameter is not properly sanitized. A malicious callback value like `alert(document.cookie)//` could inject arbitrary JavaScript. Gin mitigates this by sanitizing the callback name, removing characters that could be used for injection. However, you should still limit JSONP endpoints to non-sensitive, read-only data, since any page on the web can load your JSONP endpoint via a `<script>` tag.
:::

## See also

- [XML/JSON/YAML/ProtoBuf rendering](/en/docs/rendering/rendering/)
- [SecureJSON](/en/docs/rendering/secure-json/)
- [AsciiJSON](/en/docs/rendering/ascii-json/)
- [PureJSON](/en/docs/rendering/pure-json/)
