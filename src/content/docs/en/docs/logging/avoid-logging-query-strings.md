---
title: "Avoid logging query strings"
sidebar:
  order: 5
---

Query strings often contain sensitive information such as API tokens, passwords, session IDs, or personally identifiable information (PII). Logging these values can create security risks and may violate privacy regulations like GDPR or HIPAA. By stripping query strings from your logs, you reduce the chance of leaking sensitive data through log files, monitoring systems, or error reporting tools.

Use the `SkipQueryString` option in `LoggerConfig` to prevent query strings from appearing in logs. When enabled, a request to `/path?token=secret&user=alice` will be logged simply as `/path`.

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

You can test the difference with `curl`:

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

Without `SkipQueryString`, the log entry includes the full query string:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

With `SkipQueryString: true`, the query string is stripped:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

This is particularly useful in compliance-sensitive environments where log output is forwarded to third-party services or stored long-term. Your application still has full access to query parameters through `c.Query()` -- only the log output is affected.
