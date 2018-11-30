---
title: "日本語ドキュメント"
draft: false
---

<img align="right" width="159px" src="https://raw.githubusercontent.com/gin-gonic/logo/master/color.png">


Gin は Golang で書かれた Web アプリケーションフレームワークです。[martini](https://github.com/go-martini/martini) に似たAPIを持ちながら、[httprouter](https://github.com/julienschmidt/httprouter) のおかげでそれより40倍以上も速いパフォーマンスがあります。良いパフォーマンスと生産性が必要であれば、Gin が好きになれるでしょう。

![Gin console logger](https://gin-gonic.github.io/gin/other/console.png)

## Contents

- [インストール](#インストール)
- [要件](#要件)
- [クイックスタート](#クイックスタート)
- [ベンチマーク](#ベンチマーク)
- [Gin v1 の安定性](#Gin-v1-の安定性)
- [jsoniter でビルドする](#jsoniter-でビルドする)
- [API の例](#API-の例)
    - [GET,POST,PUT,PATCH,DELETE,OPTIONS メソッドを使う](#GETPOSTPUTPATCHDELETEOPTIONS-メソッドを使う)
    - [パスに含まれるパラメータ](#パスに含まれるパラメータ)
    - [クエリ文字列のパラメータ](#クエリ文字列のパラメータ)
    - [Multipart/Urlencoded フォーム](#MultipartUrlencoded-フォーム)
    - [別の例 フォーム投稿によるクエリ文字列](#別の例-フォーム投稿によるクエリ文字列)
    - [クエリ文字列やフォーム投稿によるパラメータをマッピングする](#クエリ文字列やフォーム投稿によるパラメータをマッピングする)
    - [ファイルのアップロード](#ファイルのアップロード)
    - [ルーティングをグループ化する](#ルーティングをグループ化する)
    - [デフォルトで設定されるミドルウェアがない空の Gin を作成する](#デフォルトで設定されるミドルウェアがない空の-Gin-を作成する)
    - [ミドルウェアを利用する](#ミドルウェアを利用する)
    - [ログファイルを書き込むには](#ログファイルを書き込むには)
    - [モデルへのバインディングとバリデーションする](#モデルへのバインディングとバリデーションする)
    - [カスタムバリデーション](#カスタムバリデーション)
    - [クエリ文字列のみバインドする](#クエリ文字列のみバインドする)
    - [クエリ文字列あるいはポストされたデータをバインドする](#クエリ文字列あるいはポストされたデータをバインドする)
	- [URLをバインドする](#URLをバインドする)
    - [HTMLチェックボックスをバインドする](#HTMLチェックボックスをバインドする)
    - [Multipart/Urlencoded されたデータをバインドする](#MultipartUrlencoded-されたデータをバインドする)
    - [XML, JSON, YAML, ProtoBuf をレンダリングする](#XML-JSON-YAML-ProtoBuf-をレンダリングする)
    - [JSONP をレンダリングする](#JSONP-をレンダリングする)
    - [静的ファイルを返す](#静的ファイルを返す)
    - [io.Reader からのデータを返す](#ioReader-からのデータを返す)
    - [HTML をレンダリングする](#HTML-をレンダリングする)
    - [複数のテンプレート](#複数のテンプレート)
    - [リダイレクト](#リダイレクト)
    - [カスタムミドルウェア](#カスタムミドルウェア)
    - [BasicAuth ミドルウェアを使う](#BasicAuth-ミドルウェアを使う)
    - [ミドルウェア内の Goroutine](#ミドルウェア内の-Goroutine)
    - [カスタム HTTP 設定](#カスタム-HTTP-設定)
    - [Let's Encrypt のサポート](#Lets-Encrypt-のサポート)
    - [Gin を使って複数のサービスを稼働させる](#Gin-を使って複数のサービスを稼働させる)
    - [graceful restart と stop](#graceful-restart-と-stop)
    - [テンプレートを含めた1つのバイナリをビルドする](#テンプレートを含めた1つのバイナリをビルドする)
    - [フォーム投稿されたリクエストを構造体にバインドする](#フォーム投稿されたリクエストを構造体にバインドする)
    - [body を異なる構造体にバインドするには](#body-を異なる構造体にバインドするには)
    - [HTTP/2 サーバープッシュ](#HTTP2-サーバープッシュ)
    - [ルーティングログのフォーマットを定義する](#ルーティングログのフォーマットを定義する)
    - [cookieの設定と取得](#cookieの設定と取得)
- [テスト](#テスト)
- [Gin を利用したプロジェクト](#Gin-を利用したプロジェクト)

## インストール

Gin をインストールするには、まず Go のインストールおよび Go のワークスペースを作ることが必要です。

1. ダウンロードしてインストールする

```sh
$ go get -u github.com/gin-gonic/gin
```

2. コード内でインポートする

```go
import "github.com/gin-gonic/gin"
```

3. (オプション) `net/http` をインポートする。`http.StatusOK` のような定数を使用する場合に必要です

```go
import "net/http"
```

### [Govendor](https://github.com/kardianos/govendor) のような vendor tool を使う

1. `go get` govendor

```sh
$ go get github.com/kardianos/govendor
```
2. プロジェクトディレクトリを作り、`cd` で中に移動する

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

3. vendor tool でプロジェクトを初期化し、Gin を追加する

```sh
$ govendor init
$ govendor fetch github.com/gin-gonic/gin@v1.3
```

4. 開始用テンプレートをプロジェクトディレクトリにコピーする

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/gin/master/examples/basic/main.go > main.go
```

5. プロジェクトを実行する

```sh
$ go run main.go
```

## 要件

Gin を利用するには Go 1.6 以上が必要です。
なお、このバージョンはまもなく Go 1.7 に引き上げられる予定です。

## クイックスタート
 
```sh
# 以下のコードを example.go ファイルにおく
$ cat example.go
```

```go
package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // 0.0.0.0:8080 でサーバーを立てます。
}
```

```
# example.go を実行し、ブラウザで 0.0.0.0:8080/ping にアクセスする
$ go run example.go
```

## ベンチマーク

Gin は [HttpRouter](https://github.com/julienschmidt/httprouter) をカスタムしたバージョンを利用しています。

[すべてのベンチマークを見る](https://github.com/gin-gonic/gin/blob/master/BENCHMARKS.md)

Benchmark name                              | (1)        | (2)         | (3) 		    | (4)
--------------------------------------------|-----------:|------------:|-----------:|---------:
**BenchmarkGin_GithubAll**                  | **30000**  |  **48375**  |     **0**  |   **0**
BenchmarkAce_GithubAll                      |   10000    |   134059    |   13792    |   167
BenchmarkBear_GithubAll                     |    5000    |   534445    |   86448    |   943
BenchmarkBeego_GithubAll                    |    3000    |   592444    |   74705    |   812
BenchmarkBone_GithubAll                     |     200    |  6957308    |  698784    |  8453
BenchmarkDenco_GithubAll                    |   10000    |   158819    |   20224    |   167
BenchmarkEcho_GithubAll                     |   10000    |   154700    |    6496    |   203
BenchmarkGocraftWeb_GithubAll               |    3000    |   570806    |  131656    |  1686
BenchmarkGoji_GithubAll                     |    2000    |   818034    |   56112    |   334
BenchmarkGojiv2_GithubAll                   |    2000    |  1213973    |  274768    |  3712
BenchmarkGoJsonRest_GithubAll               |    2000    |   785796    |  134371    |  2737
BenchmarkGoRestful_GithubAll                |     300    |  5238188    |  689672    |  4519
BenchmarkGorillaMux_GithubAll               |     100    | 10257726    |  211840    |  2272
BenchmarkHttpRouter_GithubAll               |   20000    |   105414    |   13792    |   167
BenchmarkHttpTreeMux_GithubAll              |   10000    |   319934    |   65856    |   671
BenchmarkKocha_GithubAll                    |   10000    |   209442    |   23304    |   843
BenchmarkLARS_GithubAll                     |   20000    |    62565    |       0    |     0
BenchmarkMacaron_GithubAll                  |    2000    |  1161270    |  204194    |  2000
BenchmarkMartini_GithubAll                  |     200    |  9991713    |  226549    |  2325
BenchmarkPat_GithubAll                      |     200    |  5590793    | 1499568    | 27435
BenchmarkPossum_GithubAll                   |   10000    |   319768    |   84448    |   609
BenchmarkR2router_GithubAll                 |   10000    |   305134    |   77328    |   979
BenchmarkRivet_GithubAll                    |   10000    |   132134    |   16272    |   167
BenchmarkTango_GithubAll                    |    3000    |   552754    |   63826    |  1618
BenchmarkTigerTonic_GithubAll               |    1000    |  1439483    |  239104    |  5374
BenchmarkTraffic_GithubAll                  |     100    | 11383067    | 2659329    | 21848
BenchmarkVulcan_GithubAll                   |    5000    |   394253    |   19894    |   609

- (1): 一定時間内を満たした総試行回数。高いとよりよい結果を示している。
- (2): 1試行にかかった時間(ns/op)。低いと良い。
- (3): ヒープメモリ。低いと良い。
- (4): 1試行回数当たりの平均ヒープアロケーション。低いと良い。

## Gin v1 の安定性

- [x] ヒープメモリの拡張が0のルーター
- [x] 最速の http ルーターとフレームワーク
- [x] 一揃いのユニットテストをすべて満たしている
- [x] バトルがテストされている
- [x] APIは固まっており、新しいバージョンが既存のコードを壊すことはない

## [jsoniter](https://github.com/json-iterator/go) でビルドする

Gin はデフォルトの json パッケージとして `encoding/json` を使っているが、他のタグからビルドすることで、[jsoniter](https://github.com/json-iterator/go) を使うこともできる。

```sh
$ go build -tags=jsoniter .
```

## API の例

### GET,POST,PUT,PATCH,DELETE,OPTIONS メソッドを使う

```go
func main() {
	// コンソールに出力されるテキスト色を無効にする
	// gin.DisableConsoleColor()

	// デフォルトのミドルウェアで新しい gin ルーターを作成する
	// logger とアプリケーションクラッシュをキャッチする recovery ミドルウェア
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// デフォルトではポート 8080 が利用されるが、
	// 環境変数 PORT を指定していればそちらが優先される。
	router.Run()
	// router.Run(":3000") と書くことでポートをハードコーディングできる
}
```

### パスに含まれるパラメータ

```go
func main() {
	router := gin.Default()

	// このハンドラは /user/john にはマッチするが、/user/ や /user にはマッチしない
	router.GET("/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		c.String(http.StatusOK, "Hello %s", name)
	})

	// しかし、下記は /user/john/ と /user/john/send にマッチする
	// もしほかのルーターが /user/john にマッチしなければ、/user/john/ にリダイレクトしてくれる
	router.GET("/user/:name/*action", func(c *gin.Context) {
		name := c.Param("name")
		action := c.Param("action")
		message := name + " is " + action
		c.String(http.StatusOK, message)
	})

	router.Run(":8080")
}
```

### クエリ文字列のパラメータ

```go
func main() {
	router := gin.Default()

	// クエリ文字列のパラメータは、既存の Request オブジェクトによって解析される。
	// このルーターは、/welcome?firstname=Jane&lastname=Doe にマッチしたURLにアクセスすると、レスポンスを返す
	router.GET("/welcome", func(c *gin.Context) {
		firstname := c.DefaultQuery("firstname", "Guest")
		lastname := c.Query("lastname") // c.Request.URL.Query().Get("lastname") へのショートカット

		c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
	})
	router.Run(":8080")
}
```

### Multipart/Urlencoded フォーム

```go
func main() {
	router := gin.Default()

	router.POST("/form_post", func(c *gin.Context) {
		message := c.PostForm("message")
		nick := c.DefaultPostForm("nick", "anonymous")

		c.JSON(200, gin.H{
			"status":  "posted",
			"message": message,
			"nick":    nick,
		})
	})
	router.Run(":8080")
}
```

### 別の例 フォーム投稿によるクエリ文字列

```
POST /post?id=1234&page=1 HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=manu&message=this_is_great
```

```go
func main() {
	router := gin.Default()

	router.POST("/post", func(c *gin.Context) {

		id := c.Query("id")
		page := c.DefaultQuery("page", "0")
		name := c.PostForm("name")
		message := c.PostForm("message")

		fmt.Printf("id: %s; page: %s; name: %s; message: %s", id, page, name, message)
	})
	router.Run(":8080")
}
```

```
id: 1234; page: 1; name: manu; message: this_is_great
```

### クエリ文字列やフォーム投稿によるパラメータをマッピングする

```
POST /post?ids[a]=1234&ids[b]=hello HTTP/1.1
Content-Type: application/x-www-form-urlencoded

names[first]=thinkerou&names[second]=tianou
```

```go
func main() {
	router := gin.Default()

	router.POST("/post", func(c *gin.Context) {

		ids := c.QueryMap("ids")
		names := c.PostFormMap("names")

		fmt.Printf("ids: %v; names: %v", ids, names)
	})
	router.Run(":8080")
}
```

```
ids: map[b:hello a:1234], names: map[second:tianou first:thinkerou]
```

### ファイルのアップロード

#### 単一のファイル

issue [#774](https://github.com/gin-gonic/gin/issues/774) と、詳細は [サンプルコード](https://github.com/gin-gonic/gin/blob/master/examples/upload-file/single) 参照。

```go
func main() {
	router := gin.Default()
	// マルチパートフォームが利用できるメモリの制限を設定する(デフォルトは 32 MiB)
	// router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// 単一のファイル
		file, _ := c.FormFile("file")
		log.Println(file.Filename)

		// 特定のディレクトリにファイルをアップロードする
		// c.SaveUploadedFile(file, dst)

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
	router.Run(":8080")
}
```

`curl` での使い方:

```bash
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```

#### 複数のファイル

詳細は [サンプルコード](https://github.com/gin-gonic/gin/blob/master/examples/upload-file/multiple) 参照のこと.

```go
func main() {
	router := gin.Default()
	// マルチパートフォームが利用できるメモリの制限を設定する(デフォルトは 32 MiB)
	// router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// マルチパートフォーム
		form, _ := c.MultipartForm()
		files := form.File["upload[]"]

		for _, file := range files {
			log.Println(file.Filename)

			// 特定のディレクトリにファイルをアップロードする
			// c.SaveUploadedFile(file, dst)
		}
		c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
	})
	router.Run(":8080")
}
```

`curl` での使い方:

```bash
curl -X POST http://localhost:8080/upload \
  -F "upload[]=@/Users/appleboy/test1.zip" \
  -F "upload[]=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```

### ルーティングをグループ化する

```go
func main() {
	router := gin.Default()

	// v1 のグループ
	v1 := router.Group("/v1")
	{
		v1.POST("/login", loginEndpoint)
		v1.POST("/submit", submitEndpoint)
		v1.POST("/read", readEndpoint)
	}

	// v2 のグループ
	v2 := router.Group("/v2")
	{
		v2.POST("/login", loginEndpoint)
		v2.POST("/submit", submitEndpoint)
		v2.POST("/read", readEndpoint)
	}

	router.Run(":8080")
}
```

### デフォルトで設定されるミドルウェアがない空の Gin を作成する

```go
r := gin.New()
```

下記のコードではなく、上記のコードを利用する

```go
// Default は Logger と Recovery ミドルウェアが既にアタッチされている
r := gin.Default()
```


### ミドルウェアを利用する
```go
func main() {
	// デフォルトのミドルウェアが何もない router を作成する
	r := gin.New()

	// グローバルなミドルウェア
	// Logger ミドルウェアは GIN_MODE=release を設定してても、 gin.DefaultWriter にログを出力する
	// gin.DefaultWriter はデフォルトでは os.Stdout。
	r.Use(gin.Logger())

	// Recovery ミドルウェアは panic が発生しても 500 エラーを返してくれる
	r.Use(gin.Recovery())

	// 個別のルーティングに、ミドルウェアを好きに追加することもできる
	r.GET("/benchmark", MyBenchLogger(), benchEndpoint)

	// 認証が必要なグループ
	// authorized := r.Group("/", AuthRequired())
	// 下記と同一
	authorized := r.Group("/")
	// 個別のグループのミドルウェア。この例では、AuthRequired() ミドルウェアを認証が必要なグループに設定している。
	authorized.Use(AuthRequired())
	{
		authorized.POST("/login", loginEndpoint)
		authorized.POST("/submit", submitEndpoint)
		authorized.POST("/read", readEndpoint)

		// ネストしたグループ
		testing := authorized.Group("testing")
		testing.GET("/analytics", analyticsEndpoint)
	}

	// 0.0.0.0:8080 でサーバーを立てる
	r.Run(":8080")
}
```

### ログファイルを書き込むには
```go
func main() {
	// コンソール出力時の色を無効にする。ログファイルに書き込むならば、色は不要なので。
    gin.DisableConsoleColor()

	// ファイルへログを書き込む
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

	// ログに書き込みつつ、コンソールにも出力する場合、下記のコードを利用する。
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### モデルへのバインディングとバリデーションする

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
	//		<password>123</user>
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

**リクエスト例**

```shell
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

**バリデーションをスキップする**

上記の `curl` コマンドのサンプルを実行すると、エラーが返ります。これはサンプルコードで `binding:"required"` が `Password` フィールドに指定されているからです。`binding:"-"` を `Password` フィールドに指定することで、上記のサンプルを実行してもエラーは返らなくなります。

### カスタムバリデーション

カスタムしたバリデーションを使用することもできます。[サンプルコード](https://github.com/gin-gonic/gin/blob/master/examples/custom-validation/server.go) も見てみてください。

[embedmd]:# (examples/custom-validation/server.go go)
```go
package main

import (
	"net/http"
	"reflect"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"gopkg.in/go-playground/validator.v8"
)

// Booking はバリデーションされてバインドされたデータを持ちます
type Booking struct {
	CheckIn  time.Time `form:"check_in" binding:"required,bookabledate" time_format:"2006-01-02"`
	CheckOut time.Time `form:"check_out" binding:"required,gtfield=CheckIn" time_format:"2006-01-02"`
}

func bookableDate(
	v *validator.Validate, topStruct reflect.Value, currentStructOrField reflect.Value,
	field reflect.Value, fieldType reflect.Type, fieldKind reflect.Kind, param string,
) bool {
	if date, ok := field.Interface().(time.Time); ok {
		today := time.Now()
		if today.Year() > date.Year() || today.YearDay() > date.YearDay() {
			return false
		}
	}
	return true
}

func main() {
	route := gin.Default()

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("bookabledate", bookableDate)
	}

	route.GET("/bookable", getBookable)
	route.Run(":8085")
}

func getBookable(c *gin.Context) {
	var b Booking
	if err := c.ShouldBindWith(&b, binding.Query); err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "Booking dates are valid!"})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}
```

```console
$ curl "localhost:8085/bookable?check_in=2018-04-16&check_out=2018-04-17"
{"message":"Booking dates are valid!"}

$ curl "localhost:8085/bookable?check_in=2018-03-08&check_out=2018-03-09"
{"error":"Key: 'Booking.CheckIn' Error:Field validation for 'CheckIn' failed on the 'bookabledate' tag"}
```

[Struct level validations](https://github.com/go-playground/validator/releases/tag/v8.7) もこの方法で登録できます。
[struct-lvl-validation のサンプルコード](https://github.com/gin-gonic/gin/blob/master/examples/struct-lvl-validations) を見ることでより学べます。

### クエリ文字列のみバインドする

`ShouldBindQuery` 関数はクエリ文字列のみをバインドし、POSTデータをバインドしません。[詳細](https://github.com/gin-gonic/gin/issues/742#issuecomment-315953017) はこちら。

```go
package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

type Person struct {
	Name    string `form:"name"`
	Address string `form:"address"`
}

func main() {
	route := gin.Default()
	route.Any("/testing", startPage)
	route.Run(":8085")
}

func startPage(c *gin.Context) {
	var person Person
	if c.ShouldBindQuery(&person) == nil {
		log.Println("====== Only Bind By Query String ======")
		log.Println(person.Name)
		log.Println(person.Address)
	}
	c.String(200, "Success")
}

```

### クエリ文字列あるいはポストされたデータをバインドする

[詳細](https://github.com/gin-gonic/gin/issues/742#issuecomment-264681292) はこちら。

```go
package main

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

type Person struct {
	Name     string    `form:"name"`
	Address  string    `form:"address"`
	Birthday time.Time `form:"birthday" time_format:"2006-01-02" time_utc:"1"`
}

func main() {
	route := gin.Default()
	route.GET("/testing", startPage)
	route.Run(":8085")
}

func startPage(c *gin.Context) {
	var person Person
	// `GET` の場合、`Form` (クエリ文字列) がバインディングのみが使われます
	// `POST` の場合、まず `JSON` か `XML` か判断するために `content-type` がチェックされ、そして `Form` (フォームデータ) が使われます。
	// 詳細は https://github.com/gin-gonic/gin/blob/master/binding/binding.go#L48 を参照
	if c.ShouldBind(&person) == nil {
		log.Println(person.Name)
		log.Println(person.Address)
		log.Println(person.Birthday)
	}

	c.String(200, "Success")
}
```

以下のコードでテストできます。
```sh
$ curl -X GET "localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
```

### URLをバインドする

[詳細](https://github.com/gin-gonic/gin/issues/846) はこちら。

```go
package main

import "github.com/gin-gonic/gin"

type Person struct {
	ID string `uri:"id" binding:"required,uuid"`
	Name string `uri:"name" binding:"required"`
}

func main() {
	route := gin.Default()
	route.GET("/:name/:id", func(c *gin.Context) {
		var person Person
		if err := c.ShouldBindUri(&person); err != nil {
			c.JSON(400, gin.H{"msg": err})
			return
		}
		c.JSON(200, gin.H{"name": person.Name, "uuid": person.ID})
	})
	route.Run(":8088")
}
```

以下のコードでテストできます。
```sh
$ curl -v localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
$ curl -v localhost:8088/thinkerou/not-uuid
```

### HTMLチェックボックスをバインドする

[詳細な情報](https://github.com/gin-gonic/gin/issues/129#issuecomment-124260092) はこちら。

main.go

```go
...

type myForm struct {
    Colors []string `form:"colors[]"`
}

...

func formHandler(c *gin.Context) {
    var fakeForm myForm
    c.ShouldBind(&fakeForm)
    c.JSON(200, gin.H{"color": fakeForm.Colors})
}

...

```

form.html

```html
<form action="/" method="POST">
    <p>Check some colors</p>
    <label for="red">Red</label>
    <input type="checkbox" name="colors[]" value="red" id="red">
    <label for="green">Green</label>
    <input type="checkbox" name="colors[]" value="green" id="green">
    <label for="blue">Blue</label>
    <input type="checkbox" name="colors[]" value="blue" id="blue">
    <input type="submit">
</form>
```

結果

```
{"color":["red","green","blue"]}
```

### Multipart/Urlencoded されたデータをバインドする

```go
package main

import (
	"github.com/gin-gonic/gin"
)

type LoginForm struct {
	User     string `form:"user" binding:"required"`
	Password string `form:"password" binding:"required"`
}

func main() {
	router := gin.Default()
	router.POST("/login", func(c *gin.Context) {
		// 明示的にバインディングを定義して、multipart form をバインドすることができます。
		// c.ShouldBindWith(&form, binding.Form)
		// あるいは、ShouldBind メソッドを使うことで、シンプルに自動でバインドすることもできます。
		var form LoginForm
		// このケースでは正しいバインディングが自動で選択されます。
		if c.ShouldBind(&form) == nil {
			if form.User == "user" && form.Password == "password" {
				c.JSON(200, gin.H{"status": "you are logged in"})
			} else {
				c.JSON(401, gin.H{"status": "unauthorized"})
			}
		}
	})
	router.Run(":8080")
}
```

以下のコードでテストできます。
```sh
$ curl -v --form user=user --form password=password http://localhost:8080/login
```

### XML, JSON, YAML, ProtoBuf をレンダリングする

```go
func main() {
	r := gin.Default()

	// gin.H は map[string]interface{} へのショートカットです。
	r.GET("/someJSON", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
	})

	r.GET("/moreJSON", func(c *gin.Context) {
		// 構造体を使うこともできます。
		var msg struct {
			Name    string `json:"user"`
			Message string
			Number  int
		}
		msg.Name = "Lena"
		msg.Message = "hey"
		msg.Number = 123
		// msg.Name は JSON 内で "user" となることに注意してください
		// 右記が出力されます  :   {"user": "Lena", "Message": "hey", "Number": 123}
		c.JSON(http.StatusOK, msg)
	})

	r.GET("/someXML", func(c *gin.Context) {
		c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
	})

	r.GET("/someYAML", func(c *gin.Context) {
		c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
	})

	r.GET("/someProtoBuf", func(c *gin.Context) {
		reps := []int64{int64(1), int64(2)}
		label := "test"
		// protobuf の定義は testdata/protoexample にかかれています。
		data := &protoexample.Test{
			Label: &label,
			Reps:  reps,
		}
		// データはレスポンス時にバイナリデータになることに注意してください。
		// protoexample.Test の protobuf でシリアライズされたデータが出力されます。
		c.ProtoBuf(http.StatusOK, data)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```

#### SecureJSON

SecureJSON メソッドを使うことで、JSON ハイジャックを防げます。与えられた構造体が Array であれば、
デフォルトで `"while(1),"` がレスポンスに含まれます。

```go
func main() {
	r := gin.Default()

	// 別の prefix を使うこともできます
	// r.SecureJsonPrefix(")]}',\n")

	r.GET("/someJSON", func(c *gin.Context) {
		names := []string{"lena", "austin", "foo"}

		// while(1);["lena","austin","foo"] が出力されます。
		c.SecureJSON(http.StatusOK, names)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```
#### JSONP をレンダリングする

JSONP を使うことで、別のドメインのサーバーからレスポンスを受け取ることができます。callback をクエリ文字列に指定することで、レスポンスに callback を追加します。

```go
func main() {
	r := gin.Default()

	r.GET("/JSONP?callback=x", func(c *gin.Context) {
		data := map[string]interface{}{
			"foo": "bar",
		}
		
		//callback は x です。
		// x({\"foo\":\"bar\"}) が出力されます。
		c.JSONP(http.StatusOK, data)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```

#### AsciiJSON

AsciiJSON メソッドを使うことで、ASCII 文字列以外をエスケープした
ASCII 文字列のみの JSON を出力できます。

```go
func main() {
	r := gin.Default()

	r.GET("/someJSON", func(c *gin.Context) {
		data := map[string]interface{}{
			"lang": "GO语言",
			"tag":  "<br>",
		}

		// {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"} が出力されます
		c.AsciiJSON(http.StatusOK, data)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```

#### PureJSON

通常、JSON メソッドは `<` のようなHTML 文字を `\u003c` のような Unicode に置き換えます。
もしこのような文字をそのままエンコードしたい場合、PureJSON メソッドを代わりに使用してください。
この機能は、Go 1.6 以下では使えません。

```go
func main() {
	r := gin.Default()
	
	// Unicode を返します
	r.GET("/json", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// そのままの文字を返します
	r.GET("/purejson", func(c *gin.Context) {
		c.PureJSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```

### 静的ファイルを返す

```go
func main() {
	router := gin.Default()
	router.Static("/assets", "./assets")
	router.StaticFS("/more_static", http.Dir("my_file_system"))
	router.StaticFile("/favicon.ico", "./resources/favicon.ico")

	// 0.0.0.0:8080 でサーバーを立てます。
	router.Run(":8080")
}
```

### io.Reader からのデータを返す

```go
func main() {
	router := gin.Default()
	router.GET("/someDataFromReader", func(c *gin.Context) {
		response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
		if err != nil || response.StatusCode != http.StatusOK {
			c.Status(http.StatusServiceUnavailable)
			return
		}

		reader := response.Body
		contentLength := response.ContentLength
		contentType := response.Header.Get("Content-Type")

		extraHeaders := map[string]string{
			"Content-Disposition": `attachment; filename="gopher.png"`,
		}

		c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
	})
	router.Run(":8080")
}
```

### HTML をレンダリングする

LoadHTMLGlob() あるいは LoadHTMLFiles() メソッドを使用してください。

```go
func main() {
	router := gin.Default()
	router.LoadHTMLGlob("templates/*")
	//router.LoadHTMLFiles("templates/template1.html", "templates/template2.html")
	router.GET("/index", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl", gin.H{
			"title": "Main website",
		})
	})
	router.Run(":8080")
}
```

templates/index.tmpl

```html
<html>
	<h1>
		{{ .title }}
	</h1>
</html>
```

別のディレクトリにある同名のテンプレートを使う方法です。

```go
func main() {
	router := gin.Default()
	router.LoadHTMLGlob("templates/**/*")
	router.GET("/posts/index", func(c *gin.Context) {
		c.HTML(http.StatusOK, "posts/index.tmpl", gin.H{
			"title": "Posts",
		})
	})
	router.GET("/users/index", func(c *gin.Context) {
		c.HTML(http.StatusOK, "users/index.tmpl", gin.H{
			"title": "Users",
		})
	})
	router.Run(":8080")
}
```

templates/posts/index.tmpl

```html
{{ define "posts/index.tmpl" }}
<html><h1>
	{{ .title }}
</h1>
<p>Using posts/index.tmpl</p>
</html>
{{ end }}
```

templates/users/index.tmpl

```html
{{ define "users/index.tmpl" }}
<html><h1>
	{{ .title }}
</h1>
<p>Using users/index.tmpl</p>
</html>
{{ end }}
```

#### カスタムテンプレートエンジン

独自のHTMLテンプレートエンジンを使うこともできます。

```go
import "html/template"

func main() {
	router := gin.Default()
	html := template.Must(template.ParseFiles("file1", "file2"))
	router.SetHTMLTemplate(html)
	router.Run(":8080")
}
```

#### カスタムデリミタ

独自のデリミタを使用することもできます。

```go
	r := gin.Default()
	r.Delims("{[{", "}]}")
	r.LoadHTMLGlob("/path/to/templates")
```

#### カスタムテンプレート関数

詳細は [サンプルコード](https://github.com/gin-gonic/gin/blob/master/examples/template) を参照。

main.go

```go
import (
    "fmt"
    "html/template"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

func formatAsDate(t time.Time) string {
    year, month, day := t.Date()
    return fmt.Sprintf("%d%02d/%02d", year, month, day)
}

func main() {
    router := gin.Default()
    router.Delims("{[{", "}]}")
    router.SetFuncMap(template.FuncMap{
        "formatAsDate": formatAsDate,
    })
    router.LoadHTMLFiles("./testdata/template/raw.tmpl")

    router.GET("/raw", func(c *gin.Context) {
        c.HTML(http.StatusOK, "raw.tmpl", map[string]interface{}{
            "now": time.Date(2017, 07, 01, 0, 0, 0, 0, time.UTC),
        })
    })

    router.Run(":8080")
}

```

raw.tmpl

```html
Date: {[{.now | formatAsDate}]}
```

Result:
```
Date: 2017/07/01
```

### 複数のテンプレート

Gin はデフォルトでは、1つの html.Template しか使用できません。
go 1.6 の `block template` のような機能が使用できる [a multitemplate render](https://github.com/gin-contrib/multitemplate) を検討してください。

### リダイレクト

HTTP リダイレクトするのは簡単です。内部パス、外部URL両方のリダイレクトに対応しています。

```go
r.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```


Router でリダイレクトするには、下記のように `HandleContext` メソッドを使ってください。

``` go
r.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    r.HandleContext(c)
})
r.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```


### カスタムミドルウェア

```go
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// サンプル変数を設定
		c.Set("example", "12345")

		// request 処理の前

		c.Next()

		// request 処理の後
		latency := time.Since(t)
		log.Print(latency)

		// 送信予定のステータスコードにアクセスする
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {
	r := gin.New()
	r.Use(Logger())

	r.GET("/test", func(c *gin.Context) {
		example := c.MustGet("example").(string)

		// "12345" が表示される
		log.Println(example)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```

### BasicAuth ミドルウェアを使う

```go
// 秘匿されたデータをシミュレートする
var secrets = gin.H{
	"foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
	"austin": gin.H{"email": "austin@example.com", "phone": "666"},
	"lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func main() {
	r := gin.Default()

	// gin.BasicAuth() ミドルウェアを使用したグループ
	// gin.Accounts は map[string]string へのショートカットです。
	authorized := r.Group("/admin", gin.BasicAuth(gin.Accounts{
		"foo":    "bar",
		"austin": "1234",
		"lena":   "hello2",
		"manu":   "4321",
	}))

	// /admin/secrets エンドポイントは localhost:8080/admin/secrets です。
	authorized.GET("/secrets", func(c *gin.Context) {
		// BasicAuth ミドルウェアで設定されたユーザー名にアクセスします。
		user := c.MustGet(gin.AuthUserKey).(string)
		if secret, ok := secrets[user]; ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
		}
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```

### ミドルウェア内の Goroutine

新しい goroutine をミドルウェアやハンドラー内で生成する場合、goroutine の内部でオリジナルの context を **使用しないでください**。読み込み用のコピーを使ってください。

```go
func main() {
	r := gin.Default()

	r.GET("/long_async", func(c *gin.Context) {
		// goroutine 内で使用するコピーを生成します
		cCp := c.Copy()
		go func() {
			// time.Sleep() を使って、長時間かかる処理をシミュレートします。5秒です。
			time.Sleep(5 * time.Second)

			// コピーされた context である "cCp" を使ってください。重要！
			log.Println("Done! in path " + cCp.Request.URL.Path)
		}()
	})

	r.GET("/long_sync", func(c *gin.Context) {
		// time.Sleep() を使って、長時間かかる処理をシミュレートします。5秒です。
		time.Sleep(5 * time.Second)

		// goroutine を使ってなければ、context をコピーする必要はありません。
		log.Println("Done! in path " + c.Request.URL.Path)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```

### カスタム HTTP 設定

以下のように `http.ListenAndServe()` を直接使ってください。

```go
func main() {
	router := gin.Default()
	http.ListenAndServe(":8080", router)
}
```
あるいは

```go
func main() {
	router := gin.Default()

	s := &http.Server{
		Addr:           ":8080",
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	s.ListenAndServe()
}
```

### Let's Encrypt のサポート

1行の Let's Encrypt HTTPS サーバーのサンプルコードです。

[embedmd]:# (examples/auto-tls/example1/main.go go)
```go
package main

import (
	"log"

	"github.com/gin-gonic/autotls"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Ping handler
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	log.Fatal(autotls.Run(r, "example1.com", "example2.com"))
}
```

カスタム autocert manager を利用したサンプルコードです。

[embedmd]:# (examples/auto-tls/example2/main.go go)
```go
package main

import (
	"log"

	"github.com/gin-gonic/autotls"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	r := gin.Default()

	// Ping handler
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	m := autocert.Manager{
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist("example1.com", "example2.com"),
		Cache:      autocert.DirCache("/var/www/.cache"),
	}

	log.Fatal(autotls.RunWithManager(r, &m))
}
```

### Gin を使って複数のサービスを稼働させる

[issue](https://github.com/gin-gonic/gin/issues/346) を見て、以下のサンプルコードを試してみてください。

[embedmd]:# (examples/multiple-service/main.go go)
```go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/sync/errgroup"
)

var (
	g errgroup.Group
)

func router01() http.Handler {
	e := gin.New()
	e.Use(gin.Recovery())
	e.GET("/", func(c *gin.Context) {
		c.JSON(
			http.StatusOK,
			gin.H{
				"code":  http.StatusOK,
				"error": "Welcome server 01",
			},
		)
	})

	return e
}

func router02() http.Handler {
	e := gin.New()
	e.Use(gin.Recovery())
	e.GET("/", func(c *gin.Context) {
		c.JSON(
			http.StatusOK,
			gin.H{
				"code":  http.StatusOK,
				"error": "Welcome server 02",
			},
		)
	})

	return e
}

func main() {
	server01 := &http.Server{
		Addr:         ":8080",
		Handler:      router01(),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	server02 := &http.Server{
		Addr:         ":8081",
		Handler:      router02(),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	g.Go(func() error {
		return server01.ListenAndServe()
	})

	g.Go(func() error {
		return server02.ListenAndServe()
	})

	if err := g.Wait(); err != nil {
		log.Fatal(err)
	}
}
```

### graceful restart と stop

graceful restart と stop をしたいですか？
いくつかの方法があります。

[fvbock/endless](https://github.com/fvbock/endless) を使って、デフォルトの `ListenAndServe` を置き換えることができます。詳細は Issue [#296](https://github.com/gin-gonic/gin/issues/296) を参照ください。

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

endless の代わりは以下があります。

* [manners](https://github.com/braintree/manners): A polite Go HTTP server that shuts down gracefully.
* [graceful](https://github.com/tylerb/graceful): Graceful is a Go package enabling graceful shutdown of an http.Handler server.
* [grace](https://github.com/facebookgo/grace): Graceful restart & zero downtime deploy for Go servers.

もし Go 1.8 を使っているなら、これらのライブラリを使う必要はないかもしれません！http.Server 組み込みの [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) メソッドを、graceful shutdowns に利用することを検討してみてください。詳細は Gin の [graceful-shutdown](https://github.com/gin-gonic/gin/blob/master/examples/graceful-shutdown) サンプルコードを見てみてください。

[embedmd]:# (examples/graceful-shutdown/graceful-shutdown/server.go go)
```go
// +build go1.8

package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		time.Sleep(5 * time.Second)
		c.String(http.StatusOK, "Welcome Gin Server")
	})

	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	go func() {
		// サービスの接続
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// シグナル割り込みを待ち、タイムアウト時間が5秒の graceful shutdown をする
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	log.Println("Server exiting")
}
```

### テンプレートを含めた1つのバイナリをビルドする

[go-assets](https://github.com/jessevdk/go-assets) を利用することで、サーバーアプリケーションを、テンプレートを含む1つのバイナリにまとめることができます。

[go-assets]: https://github.com/jessevdk/go-assets

```go
func main() {
	r := gin.New()

	t, err := loadTemplate()
	if err != nil {
		panic(err)
	}
	r.SetHTMLTemplate(t)

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "/html/index.tmpl",nil)
	})
	r.Run(":8080")
}

// loadTemplate は go-assets-builder によって埋め込まれたテンプレートたちをロードします。
func loadTemplate() (*template.Template, error) {
	t := template.New("")
	for name, file := range Assets.Files {
		if file.IsDir() || !strings.HasSuffix(name, ".tmpl") {
			continue
		}
		h, err := ioutil.ReadAll(file)
		if err != nil {
			return nil, err
		}
		t, err = t.New(name).Parse(string(h))
		if err != nil {
			return nil, err
		}
	}
	return t, nil
}
```

完全なサンプルコードは、[examples/assets-in-binary](https://github.com/gin-gonic/gin/tree/master/examples/assets-in-binary) を見てください。

### フォーム投稿されたリクエストを構造体にバインドする

下記のサンプルコードは、カスタム構造体を使っています。

```go
type StructA struct {
    FieldA string `form:"field_a"`
}

type StructB struct {
    NestedStruct StructA
    FieldB string `form:"field_b"`
}

type StructC struct {
    NestedStructPointer *StructA
    FieldC string `form:"field_c"`
}

type StructD struct {
    NestedAnonyStruct struct {
        FieldX string `form:"field_x"`
    }
    FieldD string `form:"field_d"`
}

func GetDataB(c *gin.Context) {
    var b StructB
    c.Bind(&b)
    c.JSON(200, gin.H{
        "a": b.NestedStruct,
        "b": b.FieldB,
    })
}

func GetDataC(c *gin.Context) {
    var b StructC
    c.Bind(&b)
    c.JSON(200, gin.H{
        "a": b.NestedStructPointer,
        "c": b.FieldC,
    })
}

func GetDataD(c *gin.Context) {
    var b StructD
    c.Bind(&b)
    c.JSON(200, gin.H{
        "x": b.NestedAnonyStruct,
        "d": b.FieldD,
    })
}

func main() {
    r := gin.Default()
    r.GET("/getb", GetDataB)
    r.GET("/getc", GetDataC)
    r.GET("/getd", GetDataD)

    r.Run()
}
```

`curl` を使った結果です。

```
$ curl "http://localhost:8080/getb?field_a=hello&field_b=world"
{"a":{"FieldA":"hello"},"b":"world"}
$ curl "http://localhost:8080/getc?field_a=hello&field_c=world"
{"a":{"FieldA":"hello"},"c":"world"}
$ curl "http://localhost:8080/getd?field_x=hello&field_d=world"
{"d":"world","x":{"FieldX":"hello"}}
```

**NOTE**: 下記の構造体はサポートしています。

```go
type StructX struct {
    X struct {} `form:"name_x"` // ここが form を持ってしまっている
}

type StructY struct {
    Y StructX `form:"name_y"` // ここが form を持ってしまっている
}

type StructZ struct {
    Z *StructZ `form:"name_z"` // ここが form を持ってしまっている
}
```

端的に言えば、ネストした構造体は `form` を今は持つことができません。

### body を異なる構造体にバインドするには

通常のリクエスト本文をバインドするメソッドたちは、`c.Request.Body` を消費します。よってそれらのメソッドは複数回呼び出すことができません。

```go
type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // この c.ShouldBind メソッドは c.Request.Body を消費し、再利用できなくします。
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // c.Request.Body が EOF なので、常にエラーとなります。
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

複数回呼び出したい場合、`c.ShouldBindBodyWith` を使ってください。

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // このコードは、c.Request.Body を読み込み、そして結果を context に保存します。
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // ここでは、context に保存された body を再利用します。
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // 他のフォーマットも受け付けます。
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith` はバインド前に context にリクエスト本文を保存します。この処理は、パフォーマンスにわずかな影響を与えます。バインディングが一度だけで良いなら、このメソッドは使うべきではありません。
* この機能は `JSON`, `XML`, `MsgPack`,`ProtoBuf` のフォーマットでのみ必要です。`Query`, `Form`, `FormPost`, `FormMultipart` のような他のフォーマットでは `c.ShouldBind()` を何度も呼び出せるので、パフォーマンスへの影響はありません。(Issue [#1341](https://github.com/gin-gonic/gin/pull/1341) も参照ください)

### HTTP/2 サーバープッシュ

http.Pusher は **go1.8+** 以降でのみサポートしています。 詳細な情報は [golang blog](https://blog.golang.org/h2push) を見てください。

[embedmd]:# (examples/http-pusher/main.go go)
```go
package main

import (
	"html/template"
	"log"

	"github.com/gin-gonic/gin"
)

var html = template.Must(template.New("https").Parse(`
<html>
<head>
  <title>Https Test</title>
  <script src="/assets/app.js"></script>
</head>
<body>
  <h1 style="color:red;">Welcome, Ginner!</h1>
</body>
</html>
`))

func main() {
	r := gin.Default()
	r.Static("/assets", "./assets")
	r.SetHTMLTemplate(html)

	r.GET("/", func(c *gin.Context) {
		if pusher := c.Writer.Pusher(); pusher != nil {
			// サーバープッシュするために pusher.Push() を使う
			if err := pusher.Push("/assets/app.js", nil); err != nil {
				log.Printf("Failed to push: %v", err)
			}
		}
		c.HTML(200, "https", gin.H{
			"status": "success",
		})
	})

	// https://127.0.0.1:8080 でサーバーを立てる
	r.RunTLS(":8080", "./testdata/server.pem", "./testdata/server.key")
}
```

### ルーティングログのフォーマットを定義する

デフォルトのルーティングログは以下のようになります。
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

もしログのフォーマットを定義したい(JSONやキーバリュー形式、その他)なら、`gin.DebugPrintRouteFunc` を定義することで可能です。
以下のサンプルコードでは、すべてのルーティングを標準の log パッケージで記録していますが、必要に応じて最適な別のログツールを利用することも可能です。

```go
import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
		log.Printf("endpoint %v %v %v %v\n", httpMethod, absolutePath, handlerName, nuHandlers)
	}

	r.POST("/foo", func(c *gin.Context) {
		c.JSON(http.StatusOK, "foo")
	})

	r.GET("/bar", func(c *gin.Context) {
		c.JSON(http.StatusOK, "bar")
	})

	r.GET("/status", func(c *gin.Context) {
		c.JSON(http.StatusOK, "ok")
	})

	// http://0.0.0.0:8080 でサーバーを立てる
	r.Run()
}
```

### cookieの設定と取得

```go
import (
    "fmt"

    "github.com/gin-gonic/gin"
)

func main() {

    router := gin.Default()

    router.GET("/cookie", func(c *gin.Context) {

        cookie, err := c.Cookie("gin_cookie")

        if err != nil {
            cookie = "NotSet"
            c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
        }

        fmt.Printf("Cookie value: %s \n", cookie)
    })

    router.Run()
}
```


## テスト

`net/http/httptest` パッケージが、HTTP テストをするには好ましい方法です。

```go
package main

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	return r
}

func main() {
	r := setupRouter()
	r.Run(":8080")
}
```

テストコードの例は以下のようになります。

```go
package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPingRoute(t *testing.T) {
	router := setupRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "pong", w.Body.String())
}
```

## Gin を利用したプロジェクト

[Gin](https://github.com/gin-gonic/gin) を利用している素晴らしいプロジェクト一覧。

* [drone](https://github.com/drone/drone): Drone is a Continuous Delivery platform built on Docker, written in Go.
* [gorush](https://github.com/appleboy/gorush): A push notification server written in Go.
* [fnproject](https://github.com/fnproject/fn): The container native, cloud agnostic serverless platform.
* [photoprism](https://github.com/photoprism/photoprism): Personal photo management powered by Go and Google TensorFlow.
* [krakend](https://github.com/devopsfaith/krakend): Ultra performant API Gateway with middlewares.
* [picfit](https://github.com/thoas/picfit): An image resizing server written in Go.
