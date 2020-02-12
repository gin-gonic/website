---
title: "モデルへのバインディングとバリデーションする"
draft: false
---

リクエストボディをある型にバインドするには、モデルへのバインディングを利用してください。Gin は今のところ JSON, XML, YAML と標準的なフォームの値(foo=bar&boo=baz)をサポートしています。

Gin は [**go-playground/validator.v8**](https://github.com/go-playground/validator) をバリデーションに使用しています。 タグの使い方のすべてのドキュメントを読むには [ここ](http://godoc.org/gopkg.in/go-playground/validator.v8#hdr-Baked_In_Validators_and_Tags) を参照してください。

バインドしたいすべてのフィールドに対応するタグを設定する必要があることに注意してください。たとえば、JSONからバインドする場合は、`json:"fieldname"` を設定します。

また、Gin は2種類のバインドのためのメソッドを用意しています。
- **種類** - Must bind
  - **メソッド** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **挙動** - これらのメソッドは、内部では `MustBindWith` メソッドを使っています。もしバインド時にエラーがあった場合、ユーザーからのリクエストは `c.AbortWithError(400, err).SetType(ErrorTypeBind)` で中止されます。この処理は、ステータスコード 400 を設定し、`Content-Type` ヘッダーに `text/plain; charset=utf-8` をセットします。もしこのあとにステータスコードを設定しようとした場合、`[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422` という注意メッセージが表示されるので注意してください。もしこの挙動をよりコントロールする必要がある場合、`ShouldBind` という同様のメソッドを利用することを検討してください。
- **種類** - Should bind
  - **メソッド** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **挙動** - これらのメソッドは、内部では `ShouldBindWith` メソッドを使っています。もしバインド時にエラーがあった場合、エラーが返ってくるので、開発者の責任で、適切にエラーやリクエストをハンドリングします。

`Bind` メソッドを使用するとき、Gin は Content-Type ヘッダーに応じて何のバインダーでバインドするか推測しようとします。もし何のバインダーでバインドするかわかるならば、`MustBindWith` や `ShouldBindWith` が使えます。

また、どのフィールドが必須か指定することができます。もしフィールドが、`binding:"required"` 指定されていて、バインディングの際に値が空であれば、エラーが返ります。

```go
// JSON からバインドする
type Login struct {
	User     string `form:"user" json:"user" xml:"user"  binding:"required"`
	Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
	router := gin.Default()

	// JSON でバインドする例 ({"user": "manu", "password": "123"})
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

	// XML でバインドする例 (
	//	<?xml version="1.0" encoding="UTF-8"?>
	//	<root>
	//		<user>user</user>
	//		<password>123</password>
	//	</root>)
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

	// HTML Form からバインドする例 (user=manu&password=123)
	router.POST("/loginForm", func(c *gin.Context) {
		var form Login
		// このコードは、content-type ヘッダーから類推して HTML Form でバインドする
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

	// 0.0.0.0:8080 でサーバーを立てる
	router.Run(":8080")
}
```

### リクエスト例

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

### バリデーションをスキップする

上記の `curl` コマンドのサンプルを実行すると、エラーが返ります。これはサンプルコードで `binding:"required"` が `Password` フィールドに指定されているからです。`binding:"-"` を `Password` フィールドに指定することで、上記のサンプルを実行してもエラーは返らなくなります。


