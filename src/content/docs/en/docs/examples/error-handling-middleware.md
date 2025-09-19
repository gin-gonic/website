---
title: "Error handling middleware"
---

In a typical RESTful application, you might encounter errors in any route such as:

- Invalid input from the user
- Database failures
- Unauthorized access
- Internal server bugs

By default, Gin allows you to handle errors manually in each route using `c.Error(err)`.
But this can quickly become repetitive and inconsistent.

To solve this, we can use custom middleware to handle all errors in one place.
This middleware runs after each request and checks for any errors added to the Gin context (`c.Errors`).
If it finds one, it sends a structured JSON response with a proper status code.

#### Example

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Step1: Process the request first.

        // Step2: Check if any errors were added to the context
        if len(c.Errors) > 0 {
            // Step3: Use the last error
            err := c.Errors.Last().Err

            // Step4: Respond with a generic error message
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // Any other steps if no errors are found
    }
}

func main() {
    r := gin.Default()

    // Attach the error-handling middleware
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### Extensions

- Map errors to status codes
- Generate different error responses based on error codes
- Log errors using

#### Benefits of Error-Handling Middleware

- **Consistency**: All errors follow the same format
- **Clean routes**: Business logic is separated from error formatting
- **Less duplication**: No need to repeat error-handling logic in every handler
