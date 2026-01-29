---
title: "Live Reloading with Air"
---

## Description
This project demonstrates how to use [Air](https://github.com/air-verse/air) for live reloading in a [Gin](https://github.com/gin-gonic/gin) application. Air automatically rebuilds and restarts your application whenever you modify a file, significantly speeding up the development process.

## Requirements
- [Go](https://go.dev/) (version 1.22 or higher recommended)
- [Air](https://github.com/air-verse/air)

## Setup

### Clone the repository

```bash
git clone https://github.com/raza001/gin_air.git
cd gin_air
```

### Install the dependencies

```bash
go mod download
```

### Install Air

```bash
go install github.com/air-verse/air@latest
```

## Configuration

The project uses a `.air.toml` file to configure Air. This file is generated using `air init` and can be customized to change the build command, binary execution, watched files, and more.

Key settings in `.air.toml`:
- **root**: The root directory of the project.
- **tmp_dir**: Directory for build artifacts.
- **build**: Command to build the application (e.g., `go build -o ./tmp/main .`).
- **bin**: The binary to run (e.g., `./tmp/main`).
- **include_ext**: File extensions to watch (e.g., `go`, `tpl`, `tmpl`, `html`).

## Example Routes

The application defines the following routes in `main.go`:

```go
r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, Air!")
})

r.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
})
```

## Code Overview

- **main.go**: The entry point of the application. It sets up the Gin router and defines the HTTP handlers.
- **.air.toml**: Configuration file for Air.
- **Makefile**: Helper commands for running, building, and watching the project.

## Conclusion

Using Air with Gin provides a seamless development experience by automating the compile-restart cycle. This setup ensures that your changes are immediately reflected in the running application without manual intervention.

## References

- [Air Repository](https://github.com/air-verse/air)
- [Gin Web Framework](https://github.com/gin-gonic/gin)
