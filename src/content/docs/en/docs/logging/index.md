---
title: "Logging"
sidebar:
  order: 7
---

Gin includes a built-in logger middleware that records details about each HTTP request, including the status code, HTTP method, path, and latency.

When you create a router with `gin.Default()`, the logger middleware is automatically attached along with the recovery middleware:

```go
// Logger and Recovery middleware are already attached
router := gin.Default()
```

If you need full control over which middleware to use, create a router with `gin.New()` and add the logger manually:

```go
// No middleware attached
router := gin.New()

// Attach the logger middleware
router.Use(gin.Logger())
```

The default logger writes to `os.Stdout` and produces output like this for each request:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     512.345µs |       127.0.0.1 | GET      "/ping"
```

Each entry includes a timestamp, HTTP status code, request latency, client IP, HTTP method, and the requested path.

## In this section

- [**Writing logs to a file**](./write-log/) -- Redirect log output to a file, to the console, or to both at the same time.
- [**Custom log format**](./custom-log-format/) -- Define your own log format using `LoggerWithFormatter`.
- [**Skip logging**](./skip-logging/) -- Skip logging for specific paths or conditions.
- [**Controlling log output coloring**](./controlling-log-output-coloring/) -- Enable or disable colorized log output.
- [**Avoid logging query strings**](./avoid-logging-query-strings/) -- Strip query parameters from log output for security and privacy.
- [**Define format for the log of routes**](./define-format-for-the-log-of-routes/) -- Customize how registered routes are printed at startup.
