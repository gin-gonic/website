---
title: "渲染"
sidebar:
  order: 5
---

Gin 支援以多種格式渲染回應，包括 JSON、XML、YAML、ProtoBuf、HTML 等。每個渲染方法都遵循相同的模式：在 `*gin.Context` 上呼叫方法，傳入 HTTP 狀態碼和要序列化的資料。Gin 會自動處理 content-type 標頭、序列化和寫入回應。

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

你可以使用 `Accept` 標頭或查詢參數，從單一處理函式中以多種格式提供相同的資料：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/user", func(c *gin.Context) {
    user := gin.H{"name": "Lena", "role": "admin"}

    switch c.Query("format") {
    case "xml":
      c.XML(http.StatusOK, user)
    case "yaml":
      c.YAML(http.StatusOK, user)
    default:
      c.JSON(http.StatusOK, user)
    }
  })

  router.Run(":8080")
}
```

## 本節內容

- [**XML/JSON/YAML/ProtoBuf 渲染**](./rendering/) -- 以多種格式渲染回應，自動處理 content-type
- [**SecureJSON**](./secure-json/) -- 防止舊版瀏覽器中的 JSON 劫持攻擊
- [**JSONP**](./jsonp/) -- 在不使用 CORS 的情況下支援舊版客戶端的跨域請求
- [**AsciiJSON**](./ascii-json/) -- 跳脫非 ASCII 字元以確保安全傳輸
- [**PureJSON**](./pure-json/) -- 渲染 JSON 而不跳脫 HTML 字元
- [**提供靜態檔案**](./serving-static-files/) -- 提供靜態資源目錄
- [**從檔案提供資料**](./serving-data-from-file/) -- 提供單一檔案、附件和下載
- [**從 reader 提供資料**](./serving-data-from-reader/) -- 從任何 `io.Reader` 串流資料到回應
- [**HTML 渲染**](./html-rendering/) -- 使用動態資料渲染 HTML 模板
- [**多重模板**](./multiple-template/) -- 在單一應用程式中使用多組模板
- [**將模板綁定到單一二進位檔**](./bind-single-binary-with-template/) -- 將模板嵌入編譯後的二進位檔
