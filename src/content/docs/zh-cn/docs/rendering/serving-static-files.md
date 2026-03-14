---
title: "提供静态文件"
sidebar:
  order: 6
---

Gin 提供了三种方法来提供静态内容：

- **`router.Static(relativePath, root)`** — 提供整个目录。对 `relativePath` 的请求会映射到 `root` 下的文件。例如，`router.Static("/assets", "./assets")` 会在 `/assets/style.css` 处提供 `./assets/style.css`。
- **`router.StaticFS(relativePath, fs)`** — 类似于 `Static`，但接受一个 `http.FileSystem` 接口，让你可以更好地控制文件解析方式。当你需要从嵌入式文件系统提供文件或自定义目录列表行为时使用。
- **`router.StaticFile(relativePath, filePath)`** — 提供单个文件。适用于 `/favicon.ico` 或 `/robots.txt` 等端点。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::caution[安全：路径遍历]
你传递给 `Static()` 或 `http.Dir()` 的目录将完全对任何客户端开放。确保其中不包含敏感文件，如配置文件、`.env` 文件、私钥或数据库文件。

最佳实践：

- 使用专用目录，仅包含你打算公开提供的文件。
- 避免传递 `"."` 或 `"/"` 等路径，这可能会暴露你的整个项目或文件系统。
- 如果你需要更细粒度的控制（例如禁用目录列表），请使用带有自定义 `http.FileSystem` 实现的 `StaticFS`。标准的 `http.Dir` 默认启用目录列表。
:::
