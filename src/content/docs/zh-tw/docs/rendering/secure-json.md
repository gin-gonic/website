---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON` 可以防止一種稱為 **JSON 劫持**的安全漏洞。在舊版瀏覽器中（主要是 Internet Explorer 9 及更早版本），惡意頁面可以包含一個 `<script>` 標籤指向受害者的 JSON API 端點。如果該端點回傳頂層 JSON 陣列（例如 `["secret","data"]`），瀏覽器會將其作為 JavaScript 執行。透過覆寫 `Array` 建構函式，攻擊者可以攔截解析後的值並將敏感資料洩露到第三方伺服器。

**SecureJSON 如何防止這種攻擊：**

當回應資料是 JSON 陣列時，`SecureJSON` 會在回應主體前面加上一個無法解析的前綴——預設為 `while(1);`。如果回應透過 `<script>` 標籤載入，這會導致瀏覽器的 JavaScript 引擎進入無限迴圈，防止資料被存取。合法的 API 使用者（使用 `fetch`、`XMLHttpRequest` 或任何 HTTP 客戶端）讀取原始回應主體，只需在解析前移除前綴即可。

Google 的 API 使用類似的技術 `)]}'\n`，Facebook 使用 `for(;;);`。你可以使用 `router.SecureJsonPrefix()` 自訂前綴。

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
現代瀏覽器已修復此漏洞，因此 `SecureJSON` 主要適用於需要支援舊版瀏覽器或安全政策要求深度防禦的情況。對於大多數新的 API，標準的 `c.JSON()` 就已足夠。
:::
