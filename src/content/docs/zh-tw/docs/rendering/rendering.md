---
title: "XML/JSON/YAML/ProtoBuf 渲染"
sidebar:
  order: 1
---

Gin 內建支援以多種格式渲染回應，包括 JSON、XML、YAML 和 Protocol Buffers。這使得建構支援內容協商的 API 變得簡單——以客戶端請求的任何格式提供資料。

**何時使用各種格式：**

- **JSON** — REST API 和瀏覽器客戶端最常見的選擇。使用 `c.JSON()` 進行標準輸出，或在開發期間使用 `c.IndentedJSON()` 獲得人類可讀的格式。
- **XML** — 與舊系統、SOAP 服務或期望 XML 的客戶端（如某些企業應用程式）整合時很有用。
- **YAML** — 適合面向配置的端點或原生使用 YAML 的工具（如 Kubernetes 或 CI/CD 流程）。
- **ProtoBuf** — 適合服務間的高效能、低延遲通訊。Protocol Buffers 產生的酬載更小且序列化更快，但需要共享的 schema 定義（`.proto` 檔案）。

所有渲染方法都接受 HTTP 狀態碼和資料值。Gin 會序列化資料並自動設定適當的 `Content-Type` 標頭。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/testdata/protoexample"
)

func main() {
  router := gin.Default()

  // gin.H is a shortcut for map[string]interface{}
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // You also can use a struct
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // Note that msg.Name becomes "user" in the JSON
    // Will output  :   {"user": "Lena", "Message": "hey", "Number": 123}
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
    // The specific definition of protobuf is written in the testdata/protoexample file.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // Note that data becomes binary data in the response
    // Will output protoexample.Test protobuf serialized data
    c.ProtoBuf(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

## 另請參閱

- [PureJSON](/zh-tw/docs/rendering/pure-json/)
- [SecureJSON](/zh-tw/docs/rendering/secure-json/)
- [AsciiJSON](/zh-tw/docs/rendering/ascii-json/)
- [JSONP](/zh-tw/docs/rendering/jsonp/)
