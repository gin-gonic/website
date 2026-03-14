---
title: "XML/JSON/YAML/ProtoBufレンダリング"
sidebar:
  order: 1
---

Ginは、JSON、XML、YAML、Protocol Buffersなど、複数のフォーマットでのレスポンスレンダリングの組み込みサポートを提供しています。これにより、コンテンツネゴシエーションをサポートするAPI（クライアントが要求するフォーマットでデータを提供するAPI）の構築が簡単になります。

**各フォーマットの使用場面：**

- **JSON** -- REST APIやブラウザベースのクライアントで最も一般的な選択肢。標準出力には`c.JSON()`を、開発中の人間が読みやすいフォーマットには`c.IndentedJSON()`を使用します。
- **XML** -- レガシーシステム、SOAPサービス、またはXMLを期待するクライアント（一部のエンタープライズアプリケーションなど）との統合に便利です。
- **YAML** -- 設定指向のエンドポイントやYAMLをネイティブに消費するツール（KubernetesやCI/CDパイプラインなど）に適しています。
- **ProtoBuf** -- サービス間の高性能・低レイテンシ通信に最適です。Protocol Buffersはテキストベースのフォーマットと比較して、より小さなペイロードとより高速なシリアライズを実現しますが、共有スキーマ定義（`.proto`ファイル）が必要です。

すべてのレンダリングメソッドはHTTPステータスコードとデータ値を受け取ります。Ginはデータをシリアライズし、適切な`Content-Type`ヘッダーを自動的に設定します。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/testdata/protoexample"
)

func main() {
  router := gin.Default()

  // gin.Hはmap[string]interface{}のショートカットです
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // 構造体も使用できます
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // msg.NameはJSONで"user"になることに注意
    // 出力: {"user": "Lena", "Message": "hey", "Number": 123}
    c.JSON(http.StatusOK, msg)
  })

  router.GET("/someXML", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someYAML", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someProtoBuf", func(c *gin.Context) {
    reps := []int64{int64(1), int64(2)}
    label := "test"
    // protobufの具体的な定義はtestdata/protoexampleファイルに記述されています。
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // データはレスポンスでバイナリデータになることに注意
    // protoexample.Testのprotobufシリアライズデータを出力
    c.ProtoBuf(http.StatusOK, data)
  })

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```

## 関連項目

- [PureJSON](/ja/docs/rendering/pure-json/)
- [SecureJSON](/ja/docs/rendering/secure-json/)
- [AsciiJSON](/ja/docs/rendering/ascii-json/)
- [JSONP](/ja/docs/rendering/jsonp/)
