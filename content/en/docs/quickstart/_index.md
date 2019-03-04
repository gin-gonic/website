---
title: "Quickstart"
draft: false
weight: 2
---

In this quickstart, we’ll glean insights from code segments and learn how to:

## Requirements

- Go 1.6 or above

> Go 1.7 or Go 1.8 will be no longer supported soon.

## Installation

To install Gin package, you need to install Go and set your Go workspace first.

1. Download and install it:

```sh
$ go get -u github.com/gin-gonic/gin
```

2. Import it in your code:

```go
import "github.com/gin-gonic/gin"
```

3. (Optional) Import `net/http`. This is required for example if using constants such as `http.StatusOK`.

```go
import "net/http"
```

### Use a vendor tool like [Govendor](https://github.com/kardianos/govendor)

1. `go get` govendor

```sh
$ go get github.com/kardianos/govendor
```
2. Create your project folder and `cd` inside

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

3. Vendor init your project and add gin

```sh
$ govendor init
$ govendor fetch github.com/gin-gonic/gin@v1.3
```

4. Copy a starting template inside your project

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

5. Run your project

```sh
$ go run main.go
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
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}
```

And, You can run the code via `go run example.go`:

```sh
# run example.go and visit 0.0.0.0:8080/ping on browser
$ go run example.go
```

