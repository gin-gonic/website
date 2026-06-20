---
title: "JSONP"
sidebar:
  order: 3
---

JSONP（JSON with Padding）是一種在不支援 CORS 的舊版瀏覽器中進行跨域請求的技術。它透過將 JSON 回應包裝在 JavaScript 函式呼叫中來運作。瀏覽器透過 `<script>` 標籤載入回應，該標籤不受同源政策限制，包裝函式會以資料作為參數執行。

當你呼叫 `c.JSONP()` 時，Gin 會檢查 `callback` 查詢參數。如果存在，回應主體會被包裝為 `callbackName({"foo":"bar"})`，`Content-Type` 為 `application/javascript`。如果未提供 callback，回應的行為與標準 `c.JSON()` 呼叫相同。

:::note
JSONP 是一種舊版技術。對於現代應用程式，請改用 [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)。CORS 更安全，支援所有 HTTP 方法（不僅是 GET），且不需要將回應包裝在 callback 中。僅在需要支援非常舊的瀏覽器或與需要 JSONP 的第三方系統整合時才使用它。
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

使用 curl 測試，查看 JSONP 和純 JSON 回應的差異：

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[安全注意事項]
如果 callback 參數未正確清理，JSONP 端點可能容易受到 XSS 攻擊。惡意的 callback 值如 `alert(document.cookie)//` 可以注入任意 JavaScript。Gin 透過清理 callback 名稱來減輕此風險，移除可用於注入的字元。然而，你仍應將 JSONP 端點限制為非敏感的唯讀資料，因為網路上的任何頁面都可以透過 `<script>` 標籤載入你的 JSONP 端點。
:::

## 另請參閱

- [XML/JSON/YAML/ProtoBuf 渲染](/zh-tw/docs/rendering/rendering/)
- [SecureJSON](/zh-tw/docs/rendering/secure-json/)
- [AsciiJSON](/zh-tw/docs/rendering/ascii-json/)
- [PureJSON](/zh-tw/docs/rendering/pure-json/)
