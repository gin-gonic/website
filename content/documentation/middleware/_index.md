---
title: "Middleware"
weight: 40
---
In `Gin` a middleware is just a `gin.HandlerFunc`. Here is an example how you can declare a middleware

```go
func MyMiddleware() gin.HandlerFunc {
	// here goes the code that is executed only once when the middleware is added to the router
	// some initialization code
	...

	return func(c *gin.Context) {
		// now we are inside the context of a request
		// your code that is executed before the handler of the route
		...

		// the remaining part is optional, only if you want to do something
		// after the handler finished and the request was sent

		c.Next() // continue the chain of the middleware

		// your code after the handler
		...
	}
}
```
