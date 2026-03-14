---
title: "モデルバインディングとバリデーション"
sidebar:
  order: 1
---

リクエストボディを型にバインドするには、モデルバインディングを使用します。現在、JSON、XML、YAML、および標準フォーム値（foo=bar&boo=baz）のバインディングをサポートしています。

Ginはバリデーションに[**go-playground/validator/v10**](https://github.com/go-playground/validator)を使用しています。タグの使い方の完全なドキュメントは[こちら](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags)をご確認ください。

バインドしたいすべてのフィールドに対応するバインディングタグを設定する必要があることに注意してください。例えば、JSONからバインドする場合は`json:"fieldname"`を設定します。

また、Ginはバインディング用に2つのメソッドセットを提供しています：
- **タイプ** - Mustバインド
  - **メソッド** - `Bind`、`BindJSON`、`BindXML`、`BindQuery`、`BindYAML`
  - **動作** - これらのメソッドは内部で`MustBindWith`を使用します。バインディングエラーが発生した場合、`c.AbortWithError(400, err).SetType(ErrorTypeBind)`でリクエストが中断されます。レスポンスステータスコードは400に設定され、`Content-Type`ヘッダーは`text/plain; charset=utf-8`に設定されます。この後にレスポンスコードを設定しようとすると、`[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`という警告が表示されます。動作をより細かく制御したい場合は、`ShouldBind`の同等メソッドの使用を検討してください。
- **タイプ** - Shouldバインド
  - **メソッド** - `ShouldBind`、`ShouldBindJSON`、`ShouldBindXML`、`ShouldBindQuery`、`ShouldBindYAML`
  - **動作** - これらのメソッドは内部で`ShouldBindWith`を使用します。バインディングエラーが発生した場合、エラーが返され、リクエストとエラーを適切に処理するのは開発者の責任です。

Bindメソッドを使用する場合、GinはContent-Typeヘッダーに基づいてバインダーを推測しようとします。バインドする内容が確実な場合は、`MustBindWith`または`ShouldBindWith`を使用できます。

特定のフィールドが必須であることも指定できます。フィールドに`binding:"required"`が付けられていて、バインド時に空の値がある場合、エラーが返されます。

構造体のフィールドの1つがそれ自体が構造体（ネストされた構造体）である場合、その構造体のフィールドにも正しくバリデーションするために`binding:"required"`を付ける必要があります。

```go
// JSONからのバインディング
type Login struct {
  User     string `form:"user" json:"user" xml:"user"  binding:"required"`
  Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  // JSONバインディングの例 ({"user": "manu", "password": "123"})
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

  // XMLバインディングの例 (
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

  // HTMLフォームのバインディング例 (user=manu&password=123)
  router.POST("/loginForm", func(c *gin.Context) {
    var form Login
    // Content-Typeヘッダーに基づいて使用するバインダーを推測します。
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

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```

### サンプルリクエスト

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

### バリデーションのスキップ

上記の例を上記の`curl`コマンドで実行すると、エラーが返されます。これは例で`Password`に`binding:"required"`を使用しているためです。`Password`に`binding:"-"`を使用すれば、上記の例を再度実行してもエラーは返されません。

## 関連項目

- [カスタムバリデータ](/ja/docs/binding/custom-validators/)
- [クエリまたはポストデータのバインド](/ja/docs/binding/bind-query-or-post/)
