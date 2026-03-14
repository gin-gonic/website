---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON` 将数据序列化为 JSON，但会将所有非 ASCII 字符转义为 `\uXXXX` Unicode 转义序列。HTML 特殊字符如 `<` 和 `>` 也会被转义。结果是一个仅包含 7 位 ASCII 字符的响应体。

**何时使用 AsciiJSON：**

- 你的 API 消费者需要严格的 ASCII 安全响应（例如，无法处理 UTF-8 编码字节的系统）。
- 你需要将 JSON 嵌入到仅支持 ASCII 的上下文中，例如某些日志系统或遗留传输层。
- 你希望确保 `<`、`>` 和 `&` 等字符被转义，以避免将 JSON 嵌入 HTML 时的注入问题。

对于大多数现代 API，标准的 `c.JSON()` 就足够了，因为它输出有效的 UTF-8。仅在 ASCII 安全性是特定要求时才使用 `AsciiJSON`。

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

你可以使用 curl 测试此端点：

```bash
curl http://localhost:8080/someJSON
# Output: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

注意中文字符 `语言` 被替换为 `\u8bed\u8a00`，`<br>` 标签变成了 `\u003cbr\u003e`。响应体可以在任何仅支持 ASCII 的环境中安全使用。
