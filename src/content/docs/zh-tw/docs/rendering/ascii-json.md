---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON` 將資料序列化為 JSON，但會將所有非 ASCII 字元跳脫為 `\uXXXX` Unicode 跳脫序列。HTML 特殊字元如 `<` 和 `>` 也會被跳脫。結果是回應主體僅包含 7 位元 ASCII 字元。

**何時使用 AsciiJSON：**

- 你的 API 使用者需要嚴格的 ASCII 安全回應（例如，無法處理 UTF-8 編碼位元組的系統）。
- 你需要將 JSON 嵌入僅支援 ASCII 的環境中，例如某些日誌系統或舊版傳輸協定。
- 你想確保 `<`、`>` 和 `&` 等字元被跳脫，以避免 JSON 嵌入 HTML 時的注入問題。

對於大多數現代 API，標準的 `c.JSON()` 就已足夠，因為它輸出有效的 UTF-8。僅在 ASCII 安全是特定需求時才使用 `AsciiJSON`。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/someJSON", func(c *gin.Context) {
    data := map[string]interface{}{
      "lang": "GO语言",
      "tag":  "<br>",
    }

    // will output : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

你可以使用 curl 測試此端點：

```bash
curl http://localhost:8080/someJSON
# Output: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

注意中文字元 `语言` 被替換為 `\u8bed\u8a00`，`<br>` 標籤變成了 `\u003cbr\u003e`。回應主體可以安全地在任何僅支援 ASCII 的環境中使用。
