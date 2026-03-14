---
title: "日志"
sidebar:
  order: 7
---

Gin 包含一个内置的日志中间件，记录每个 HTTP 请求的详细信息，包括状态码、HTTP 方法、路径和延迟。

当你使用 `gin.Default()` 创建路由器时，日志中间件会与恢复中间件一起自动附加：

```go
// Logger and Recovery middleware are already attached
router := gin.Default()
```

如果你需要完全控制使用哪些中间件，请使用 `gin.New()` 创建路由器并手动添加日志记录器：

```go
// No middleware attached
router := gin.New()

// Attach the logger middleware
router.Use(gin.Logger())
```

默认日志记录器写入 `os.Stdout`，并为每个请求生成如下输出：

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     512.345µs |       127.0.0.1 | GET      "/ping"
```

每条记录包含时间戳、HTTP 状态码、请求延迟、客户端 IP、HTTP 方法和请求路径。

## 本节内容

- [**将日志写入文件**](./write-log/) -- 将日志输出重定向到文件、控制台或同时输出到两者。
- [**自定义日志格式**](./custom-log-format/) -- 使用 `LoggerWithFormatter` 定义自己的日志格式。
- [**跳过日志记录**](./skip-logging/) -- 对特定路径或条件跳过日志记录。
- [**控制日志输出着色**](./controlling-log-output-coloring/) -- 启用或禁用彩色日志输出。
- [**避免记录查询字符串**](./avoid-logging-query-strings/) -- 出于安全和隐私考虑，从日志输出中剥离查询参数。
- [**定义路由日志格式**](./define-format-for-the-log-of-routes/) -- 自定义启动时打印已注册路由的方式。
