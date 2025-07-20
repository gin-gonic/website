---
title: "模型綁定與驗證"
---

若要將請求內文綁定到一個類型，請使用模型綁定。我們目前支援綁定 JSON、XML、YAML 和標準表單值 (foo=bar&boo=baz)。

Gin 使用 [**go-playground/validator/v10**](https://github.com/go-playground/validator) 進行驗證。請在此處查看有關標籤用法的[完整文件](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags)。

請注意，您需要在所有要綁定的欄位上設定對應的綁定標籤。例如，從 JSON 綁定時，請設定 `json:"fieldname"`。

此外，Gin 還提供了兩組綁定方法：

- **類型** - 必須綁定
  - **方法** - `Bind`、`BindJSON`、`BindXML`、`BindQuery`、`BindYAML`
  - **行為** - 這些方法在底層使用 `MustBindWith`。如果發生綁定錯誤，請求將被中止，並回傳 `c.AbortWithError(400, err).SetType(ErrorTypeBind)`。這會將回應狀態碼設定為 400，並將 `Content-Type` 標頭設定為 `text/plain; charset=utf-8`。請注意，如果您在此之後嘗試設定回應碼，將會出現警告 `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`。如果您希望對行為有更大的控制權，請考慮使用 `ShouldBind` 的對等方法。
- **類型** - 應該綁定
  - **方法** - `ShouldBind`、`ShouldBindJSON`、`ShouldBindXML`、`ShouldBindQuery`、`ShouldBindYAML`
  - **行為** - 這些方法在底層使用 `ShouldBindWith`。如果發生綁定錯誤，將會回傳錯誤，開發人員有責任適當處理請求和錯誤。

使用 Bind 方法時，Gin 會根據 Content-Type 標頭嘗試推斷綁定器。如果您確定要綁定的內容，可以使用 `MustBindWith` 或 `ShouldBindWith`。

您還可以指定特定欄位為必填。如果欄位使用 `binding:"required"` 裝飾，但在綁定時值為空，則會回傳錯誤。

```go
// 從 JSON 綁定
type Login struct {
  User     string `form:"user" json:"user" xml:"user"  binding:"required"`
  Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // 綁定 JSON 的範例 ({"user": "manu", "password": "123"})
  router.POST("/loginJSON", func(c *gin.Context) {
    var json Login
    if err := c.ShouldBindJSON(&json); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if json.User != "manu" || json.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // 綁定 XML 的範例 (
  //  <?xml version="1.0" encoding="UTF-8"?>
  //  <root>
  //    <user>manu</user>
  //    <password>123</user>
  //  </root>)
  router.POST("/loginXML", func(c *gin.Context) {
    var xml Login
    if err := c.ShouldBindXML(&xml); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if xml.User != "manu" || xml.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // 綁定 HTML 表單的範例 (user=manu&password=123)
  router.POST("/loginForm", func(c *gin.Context) {
    var form Login
    // 這將根據 content-type 標頭推斷要使用的綁定器。
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if form.User != "manu" || form.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // 在 0.0.0.0:8080 上監聽並提供服務
  router.Run(":8080")
}
```

#### 範例請求

```sh
$ curl -v -X POST \
  http://localhost:8080/loginJSON \
  -H 'content-type: application/json' \
  -d '{ "user": "manu" }'
> POST /loginJSON HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.51.0
> Accept: */*
> content-type: application/json
> Content-Length: 18
>
* upload completely sent off: 18 out of 18 bytes
< HTTP/1.1 400 Bad Request
< Content-Type: application/json; charset=utf-8
< Date: Fri, 04 Aug 2017 03:51:31 GMT
< Content-Length: 100
<
{"error":"Key: 'Login.Password' Error:Field validation for 'Password' failed on the 'required' tag"}
```

#### 略過驗證

使用上述 `curl` 指令執行範例時，會回傳錯誤。這是因為範例中 `Password` 使用了 `binding:"required"`。如果將 `Password` 的標籤改為 `binding:"-"`，再次執行上述範例時將不會回傳錯誤。
