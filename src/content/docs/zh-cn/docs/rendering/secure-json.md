---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON` 可以防御一类称为 **JSON 劫持**的漏洞。在旧版浏览器（主要是 Internet Explorer 9 及更早版本）中，恶意页面可以包含一个 `<script>` 标签指向受害者的 JSON API 端点。如果该端点返回顶层 JSON 数组（例如 `["secret","data"]`），浏览器会将其作为 JavaScript 执行。通过覆盖 `Array` 构造函数，攻击者可以拦截解析后的值并将敏感数据泄露到第三方服务器。

**SecureJSON 如何防止这种攻击：**

当响应数据是 JSON 数组时，`SecureJSON` 在响应体前添加一个不可解析的前缀——默认为 `while(1);`。这会导致浏览器的 JavaScript 引擎进入无限循环（如果通过 `<script>` 标签加载响应），从而防止数据被访问。合法的 API 消费者（使用 `fetch`、`XMLHttpRequest` 或任何 HTTP 客户端）读取原始响应体，只需在解析前去除前缀即可。

Google 的 API 使用类似技术 `)]}'\n`，Facebook 使用 `for(;;);`。你可以通过 `router.SecureJsonPrefix()` 自定义前缀。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // You can also use your own secure json prefix
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // Will output  :   while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
现代浏览器已经修复了这个漏洞，因此 `SecureJSON` 主要在你需要支持旧版浏览器或安全策略要求纵深防御时才有意义。对于大多数新 API，标准的 `c.JSON()` 就足够了。
:::
