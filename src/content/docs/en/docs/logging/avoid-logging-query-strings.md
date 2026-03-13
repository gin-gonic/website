---
title: "Avoid logging query strings"
sidebar:
  order: 5
---

Use the `SkipQueryString` option in `LoggerConfig` to prevent query strings from appearing in logs. For example, `/path?q=1` will be logged as `/path`.

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
}
```
