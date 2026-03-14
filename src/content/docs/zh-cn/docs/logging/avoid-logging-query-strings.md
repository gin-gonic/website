---
title: "避免记录查询字符串"
sidebar:
  order: 5
---

查询字符串通常包含敏感信息，如 API 令牌、密码、会话 ID 或个人身份信息（PII）。记录这些值会产生安全风险，并可能违反 GDPR 或 HIPAA 等隐私法规。通过从日志中剥离查询字符串，可以减少通过日志文件、监控系统或错误报告工具泄露敏感数据的风险。

使用 `LoggerConfig` 中的 `SkipQueryString` 选项可以防止查询字符串出现在日志中。启用后，对 `/path?token=secret&user=alice` 的请求将简单地记录为 `/path`。

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

你可以使用 `curl` 测试差异：

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

不使用 `SkipQueryString` 时，日志记录包含完整的查询字符串：

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

使用 `SkipQueryString: true` 时，查询字符串被剥离：

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

这在日志输出被转发到第三方服务或长期存储的合规敏感环境中特别有用。你的应用仍然可以通过 `c.Query()` 完全访问查询参数——只有日志输出受到影响。
