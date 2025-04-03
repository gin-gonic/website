---
title: "Quickstart"
sidebar:
  order: 2
---

In this quickstart, we’ll glean insights from code segments and learn how to:

## Requirements

- Go 1.16 or above

## Installation

To install Gin package, you need to install Go and set your Go workspace first.
If you don't have a go.mod file, create it with `go mod init gin`.

1. Download and install it:

```sh
go get -u github.com/gin-gonic/gin
```

Or install:

```sh
go install github.com/gin-gonic/gin@latest
```

2. Import it in your code:

```go
import "github.com/gin-gonic/gin"
```

3. (Optional) Import `net/http`. This is required for example if using constants such as `http.StatusOK`.

```go
import "net/http"
```

4. Create your project folder and `cd` inside

```sh
mkdir -p project && cd "$_"
```

5. Copy a starting template inside your project

```sh
curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

6. Run your project

```sh
go run main.go
```

## Getting Started

> Unsure how to write and execute Go code? [Click here](https://golang.org/doc/code.html).

First, create a file called `example.go`:

```sh
# assume the following codes in example.go file
$ touch example.go
```

Next, put the following code inside of `example.go`:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })
  router.Run() // listen and serve on 0.0.0.0:8080
}
```

And, You can run the code via `go run example.go`:

```sh
# run example.go and visit 0.0.0.0:8080/ping on browser
$ go run example.go
```

If you prefer to use the `net/http` package, follow the code snippet below

```go
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })

  router.Run() // listen and serve on 0.0.0.0:8080
}
```

Additional information is available from the [Gin source code repository](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).
