---
title: "Redirects"
sidebar:
  order: 9
---

Gin supports both HTTP redirects (sending the client to a different URL) and router redirects (internally forwarding a request to a different handler without a round-trip to the client).

## HTTP redirects

Use `c.Redirect` with an appropriate HTTP status code to redirect the client:

- **301 (`http.StatusMovedPermanently`)** — the resource has permanently moved. Browsers and search engines update their caches.
- **302 (`http.StatusFound`)** — temporary redirect. The browser follows but does not cache the new URL.
- **307 (`http.StatusTemporaryRedirect`)** — like 302, but the browser must preserve the original HTTP method (useful for POST redirects).
- **308 (`http.StatusPermanentRedirect`)** — like 301, but the browser must preserve the original HTTP method.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // External redirect (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect from POST -- use 302 or 307 to preserve behavior
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Internal router redirect (no HTTP round-trip)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## Test it

```sh
# GET redirect -- follows to Google (use -L to follow, -I to see headers only)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- returns 302 with new location
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Internal redirect -- handled server-side, client sees final response
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
When redirecting from a POST handler, use `302` or `307` instead of `301`. A `301` redirect may cause some browsers to change the method from POST to GET, which can lead to unexpected behavior.
:::

:::tip
Internal redirects via `router.HandleContext(c)` do not send a redirect response to the client. The request is re-routed within the server, which is faster and invisible to the client.
:::

## See also

- [Grouping routes](/en/docs/routing/grouping-routes/)
