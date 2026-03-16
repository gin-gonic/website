---
title: "Error handling middleware"
sidebar:
  order: 4
---

In a typical RESTful application, you might encounter errors in any route — invalid input, database failures, unauthorized access, or internal bugs. Handling errors individually in each handler leads to repetitive code and inconsistent responses.

A centralized error-handling middleware solves this by running after each request and checking for any errors added to the Gin context via `c.Error(err)`. If errors are found, it sends a structured JSON response with a proper status code.

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## Test it

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
You can extend this pattern to map specific error types to different HTTP status codes, or to log errors to an external service before responding.
:::

## See also

- [Custom middleware](/en/docs/middleware/custom-middleware/)
- [Using middleware](/en/docs/middleware/using-middleware/)
