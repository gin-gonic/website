---
title: "Routing"
sidebar:
  order: 3
---

Gin provides a powerful routing system built on [httprouter](https://github.com/julienschmidt/httprouter) for high-performance URL matching. Under the hood, httprouter uses a [radix tree](https://en.wikipedia.org/wiki/Radix_tree) (also called a compressed trie) to store and look up routes, which means route matching is extremely fast and requires zero memory allocations per lookup. This makes Gin one of the fastest Go web frameworks available.

Routes are registered by calling an HTTP method on the engine (or a route group) and providing a URL pattern along with one or more handler functions:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## In this section

The pages below cover each routing topic in detail:

- [**Using HTTP method**](./http-method/) -- Register routes for GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS.
- [**Parameters in path**](./param-in-path/) -- Capture dynamic segments from URL paths (e.g. `/user/:name`).
- [**Querystring parameters**](./querystring-param/) -- Read query string values from the request URL.
- [**Query and post form**](./query-and-post-form/) -- Access both query string and POST form data in the same handler.
- [**Map as querystring or postform**](./map-as-querystring-or-postform/) -- Bind map parameters from query strings or POST forms.
- [**Multipart/urlencoded form**](./multipart-urlencoded-form/) -- Parse `multipart/form-data` and `application/x-www-form-urlencoded` bodies.
- [**Upload files**](./upload-file/) -- Handle single and multiple file uploads.
- [**Grouping routes**](./grouping-routes/) -- Organize routes under common prefixes with shared middleware.
- [**Redirects**](./redirects/) -- Perform HTTP and router-level redirects.
