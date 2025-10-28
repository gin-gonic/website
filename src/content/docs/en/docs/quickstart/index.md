---
title: "Quickstart"
sidebar:
  order: 2
---

Welcome to the Gin quickstart! This guide walks you through installing Gin, setting up a project, and running your first API—so you can start building web services with confidence.

## Prerequisites

- **Go**: Version 1.23 or higher should be installed.
- Confirm Go is in your `PATH` and usable from your terminal. For Go installation help, [see official docs](https://go.dev/doc/install).

---

## Step 1: Install Gin and Initialize Your Project

Start by creating a new project folder and initializing a Go module:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Add Gin as a dependency:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Step 2: Create Your First Gin App

Create a file called `main.go`:

```sh
touch main.go
```

Open `main.go` and add the following code:

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
  router.Run() // listens on 0.0.0.0:8080 by default
}
```

---

## Step 3: Run Your API Server

Start your server with:

```sh
go run main.go
```

Navigate to [http://localhost:8080/ping](http://localhost:8080/ping) in your browser, and you should see:

```json
{"message":"pong"}
```

---

## Additional Example: Using net/http with Gin

If you want to use `net/http` constants for response codes, import it as well:

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
  router.Run()
}
```

---

## Tips & Resources

- New to Go? Learn how to write and run Go code in the [official Go documentation](https://go.dev/doc/code).
- Want to practice Gin concepts hands-on? Check out our [Learning Resources](../learning-resources) for interactive challenges and tutorials.
- Need a full-featured example? Try scaffolding with:
  
  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- For more detailed documentation, visit the [Gin source code docs](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).
