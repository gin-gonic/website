---
title: "Quick start"
weight: 5
---

Assume the following code in example.go file


```sh
$ cat example.go
```

```go
package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}
```

You can run the server like so
```bash
$ go run example.go
```
and visit `0.0.0.0:8080/ping` on your browser.
