---
title: "模型綁定與驗證"
sidebar:
  order: 1
---

要將請求主體綁定到某個類型，請使用模型綁定。目前支援 JSON、XML、YAML 和標準表單值（foo=bar&boo=baz）的綁定。

Gin 使用 [**go-playground/validator/v10**](https://github.com/go-playground/validator) 進行驗證。查看標籤使用的完整文件請參考[這裡](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags)。

請注意，你需要在所有要綁定的欄位上設定對應的綁定標籤。例如，從 JSON 綁定時，需要設定 `json:"fieldname"`。

此外，Gin 提供兩組綁定方法：
- **類型** - Must bind（必須綁定）
  - **方法** - `Bind`、`BindJSON`、`BindXML`、`BindQuery`、`BindYAML`
  - **行為** - 這些方法底層使用 `MustBindWith`。如果發生綁定錯誤，請求會透過 `c.AbortWithError(400, err).SetType(ErrorTypeBind)` 中止。這會將回應狀態碼設為 400，並將 `Content-Type` 標頭設為 `text/plain; charset=utf-8`。請注意，如果你在此之後嘗試設定回應碼，將會產生警告 `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`。如果你希望更好地控制行為，請考慮使用對應的 `ShouldBind` 方法。
- **類型** - Should bind（應該綁定）
  - **方法** - `ShouldBind`、`ShouldBindJSON`、`ShouldBindXML`、`ShouldBindQuery`、`ShouldBindYAML`
  - **行為** - 這些方法底層使用 `ShouldBindWith`。如果發生綁定錯誤，錯誤會被回傳，開發者有責任適當地處理請求和錯誤。

使用 Bind 方法時，Gin 會嘗試根據 Content-Type 標頭推斷要使用的綁定器。如果你確定要綁定的內容，可以使用 `MustBindWith` 或 `ShouldBindWith`。

你也可以指定特定欄位為必填。如果一個欄位標記了 `binding:"required"` 且綁定時值為空，將會回傳錯誤。

如果結構體中的某個欄位本身也是結構體（巢狀結構體），該結構體的欄位也需要標記 `binding:"required"` 才能正確驗證。

```go
// Binding from JSON
type Login struct {
  User     string `form:"user" json:"user" xml:"user"  binding:"required"`
  Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  // Example for binding JSON ({"user": "manu", "password": "123"})
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

  // Example for binding XML (
  //  <?xml version="1.0" encoding="UTF-8"?>
  //  <root>
  //    <user>manu</user>
  //    <password>123</password>
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

  // Example for binding a HTML form (user=manu&password=123)
  router.POST("/loginForm", func(c *gin.Context) {
    var form Login
    // This will infer what binder to use depending on the content-type header.
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

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

### 範例請求

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

### 跳過驗證

使用上述 `curl` 指令執行上面的範例時，會回傳錯誤。因為範例中對 `Password` 使用了 `binding:"required"`。如果改用 `binding:"-"`，再次執行時就不會回傳錯誤。

## 另請參閱

- [自訂驗證器](/zh-tw/docs/binding/custom-validators/)
- [綁定查詢或 POST 資料](/zh-tw/docs/binding/bind-query-or-post/)
