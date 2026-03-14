---
title: "JSONP"
sidebar:
  order: 3
---

JSONP（JSON with Padding）是一种在不支持 CORS 的旧版浏览器中进行跨域请求的技术。它通过将 JSON 响应包装在 JavaScript 函数调用中来工作。浏览器通过 `<script>` 标签加载响应（不受同源策略限制），包装函数会以数据作为参数执行。

当你调用 `c.JSONP()` 时，Gin 会检查 `callback` 查询参数。如果存在，响应体将被包装为 `callbackName({"foo":"bar"})`，`Content-Type` 为 `application/javascript`。如果没有提供 callback，响应的行为与标准的 `c.JSON()` 调用相同。

:::note
JSONP 是一种遗留技术。对于现代应用，请改用 [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)。CORS 更安全，支持所有 HTTP 方法（不仅仅是 GET），并且不需要将响应包装在回调中。仅在需要支持非常旧的浏览器或与需要它的第三方系统集成时使用 JSONP。
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/JSONP", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // The callback name is read from the query string, e.g.:
    // GET /JSONP?callback=x
    // Will output  :   x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

使用 curl 测试以查看 JSONP 和普通 JSON 响应的区别：

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[安全注意事项]
如果 callback 参数没有被正确清理，JSONP 端点可能容易受到 XSS 攻击。恶意的 callback 值如 `alert(document.cookie)//` 可能会注入任意 JavaScript。Gin 通过清理 callback 名称来缓解此问题，移除可能用于注入的字符。但是，你仍应将 JSONP 端点限制为非敏感的只读数据，因为网络上的任何页面都可以通过 `<script>` 标签加载你的 JSONP 端点。
:::

## 另请参阅

- [XML/JSON/YAML/ProtoBuf 渲染](/zh-cn/docs/rendering/rendering/)
- [SecureJSON](/zh-cn/docs/rendering/secure-json/)
- [AsciiJSON](/zh-cn/docs/rendering/ascii-json/)
- [PureJSON](/zh-cn/docs/rendering/pure-json/)
