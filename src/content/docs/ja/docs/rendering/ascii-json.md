---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON`はデータをJSONにシリアライズしますが、すべての非ASCII文字を`\uXXXX`のUnicodeエスケープシーケンスに変換します。`<`や`>`などのHTML特殊文字もエスケープされます。結果として、レスポンスボディには7ビットASCII文字のみが含まれます。

**AsciiJSONの使用場面：**

- API利用者が厳密にASCIIセーフなレスポンスを要求する場合（例：UTF-8エンコードバイトを処理できないシステム）。
- 特定のロギングシステムやレガシートランスポートなど、ASCIIのみをサポートするコンテキストにJSONを埋め込む必要がある場合。
- JSONがHTML内に埋め込まれる際のインジェクション問題を避けるため、`<`、`>`、`&`などの文字を確実にエスケープしたい場合。

ほとんどのモダンAPIでは、有効なUTF-8を出力する標準の`c.JSON()`で十分です。`AsciiJSON`はASCIIの安全性が特定の要件である場合にのみ使用してください。

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

    // 出力: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```

curlでこのエンドポイントをテストできます：

```bash
curl http://localhost:8080/someJSON
# 出力: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

中国語文字の`语言`が`\u8bed\u8a00`に、`<br>`タグが`\u003cbr\u003e`に置換されていることに注目してください。レスポンスボディはASCIIのみの環境でも安全に利用できます。
