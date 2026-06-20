---
title: "Query string parameters"
sidebar:
  order: 3
---

Query string parameters are the key-value pairs that appear after the `?` in a URL (for example, `/search?q=gin&page=2`). Gin provides two methods to read them:

- `c.Query("key")` returns the value of the query parameter, or an **empty string** if the key is not present.
- `c.DefaultQuery("key", "default")` returns the value, or the specified **default value** if the key is not present.

Both methods are shortcuts for accessing `c.Request.URL.Query()` with less boilerplate.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Query string parameters are parsed using the existing underlying request object.
  // The request responds to a url matching:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // shortcut for c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

## Test it

```sh
# Both parameters provided
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# Output: Hello Jane Doe

# Missing firstname -- uses default value "Guest"
curl "http://localhost:8080/welcome?lastname=Doe"
# Output: Hello Guest Doe

# No parameters at all
curl "http://localhost:8080/welcome"
# Output: Hello Guest
```

## See also

- [Parameters in path](/en/docs/routing/param-in-path/)
