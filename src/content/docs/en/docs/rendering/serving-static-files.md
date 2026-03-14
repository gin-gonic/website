---
title: "Serving static files"
sidebar:
  order: 6
---

Gin provides three methods for serving static content:

- **`router.Static(relativePath, root)`** — Serves an entire directory. Requests to `relativePath` are mapped to files under `root`. For example, `router.Static("/assets", "./assets")` serves `./assets/style.css` at `/assets/style.css`.
- **`router.StaticFS(relativePath, fs)`** — Like `Static`, but accepts an `http.FileSystem` interface, giving you more control over how files are resolved. Use this when you need to serve files from an embedded filesystem or want to customize directory listing behavior.
- **`router.StaticFile(relativePath, filePath)`** — Serves a single file. Useful for endpoints like `/favicon.ico` or `/robots.txt`.

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

:::caution[Security: path traversal]
The directory you pass to `Static()` or `http.Dir()` will be fully accessible to any client. Make sure it does not contain sensitive files such as configuration files, `.env` files, private keys, or database files.

As a best practice:

- Use a dedicated directory that contains only the files you intend to serve publicly.
- Avoid passing paths like `"."` or `"/"` which could expose your entire project or filesystem.
- If you need finer control (for example, disabling directory listings), use `StaticFS` with a custom `http.FileSystem` implementation. The standard `http.Dir` enables directory listing by default.
:::
