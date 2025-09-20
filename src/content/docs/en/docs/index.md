---
title: "Documentation"
sidebar:
  order: 20
---

Gin is a high-performance HTTP web framework written in [Go](https://go.dev/). It provides a Martini-like API but with significantly better performance—up to 40 times faster—thanks to [httprouter](https://github.com/julienschmidt/httprouter). Gin is designed for building REST APIs, web applications, and microservices where speed and developer productivity are essential.

**Why choose Gin?**

Gin combines the simplicity of Express.js-style routing with Go's performance characteristics, making it ideal for:

- Building high-throughput REST APIs
- Developing microservices that need to handle many concurrent requests
- Creating web applications that require fast response times
- Prototyping web services quickly with minimal boilerplate

**Gin's key features:**

- **Zero allocation router** - Extremely memory-efficient routing with no heap allocations
- **High performance** - Benchmarks show superior speed compared to other Go web frameworks
- **Middleware support** - Extensible middleware system for authentication, logging, CORS, etc.
- **Crash-free** - Built-in recovery middleware prevents panics from crashing your server
- **JSON validation** - Automatic request/response JSON binding and validation
- **Route grouping** - Organize related routes and apply common middleware
- **Error management** - Centralized error handling and logging
- **Built-in rendering** - Support for JSON, XML, HTML templates, and more
- **Extensible** - Large ecosystem of community middleware and plugins

## Getting Started

### Prerequisites

- **Go version**: Gin requires [Go](https://go.dev/) version [1.23](https://go.dev/doc/devel/release#go1.23.0) or above
- **Basic Go knowledge**: Familiarity with Go syntax and package management is helpful

### Installation

With [Go's module support](https://go.dev/wiki/Modules#how-to-use-modules), simply import Gin in your code and Go will automatically fetch it during build:

```go
import "github.com/gin-gonic/gin"
```

### Your First Gin Application

Here's a complete example that demonstrates Gin's simplicity:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a Gin router with default middleware (logger and recovery)
  r := gin.Default()
  
  // Define a simple GET endpoint
  r.GET("/ping", func(c *gin.Context) {
    // Return JSON response
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  
  // Start server on port 8080 (default)
  // Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
  r.Run()
}
```

**Running the application:**

1. Save the code above as `main.go`
2. Run the application:

   ```sh
   go run main.go
   ```

3. Open your browser and visit [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. You should see: `{"message":"pong"}`

**What this example demonstrates:**

- Creating a Gin router with default middleware
- Defining HTTP endpoints with simple handler functions
- Returning JSON responses
- Starting an HTTP server

### Next Steps

After running your first Gin application, explore these resources to learn more:

#### 📚 Learning Resources

- **[Gin Quick Start Guide](./quickstart/)** - Comprehensive tutorial with API examples and build configurations
- **[Example Repository](https://github.com/gin-gonic/examples)** - Ready-to-run examples demonstrating various Gin use cases:
  - REST API development
  - Authentication & middleware
  - File uploads and downloads
  - WebSocket connections
  - Template rendering

### Official Tutorials

- [Go.dev Tutorial: Developing a RESTful API with Go and Gin](https://go.dev/doc/tutorial/web-service-gin)

## 🔌 Middleware Ecosystem

Gin has a rich ecosystem of middleware for common web development needs. Explore community-contributed middleware:

- **[gin-contrib](https://github.com/gin-contrib)** - Official middleware collection including:
  - Authentication (JWT, Basic Auth, Sessions)
  - CORS, Rate limiting, Compression
  - Logging, Metrics, Tracing
  - Static file serving, Template engines
  
- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - Additional community middleware
