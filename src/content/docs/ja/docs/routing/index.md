---
title: "ルーティング"
sidebar:
  order: 3
---

Ginは高性能なURLマッチングのために[httprouter](https://github.com/julienschmidt/httprouter)上に構築された強力なルーティングシステムを提供します。内部的にhttprouterは[基数木](https://en.wikipedia.org/wiki/Radix_tree)（圧縮トライとも呼ばれる）を使用してルートの格納と検索を行うため、ルートマッチングは非常に高速で、検索ごとのメモリアロケーションはゼロです。これによりGinは利用可能な最速のGoウェブフレームワークの一つとなっています。

ルートはエンジン（またはルートグループ）上でHTTPメソッドを呼び出し、URLパターンと1つ以上のハンドラ関数を指定することで登録します：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## このセクションの内容

以下のページでは各ルーティングトピックを詳しく説明します：

- [**HTTPメソッドの使用**](./http-method/) -- GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONSのルートを登録します。
- [**パス内のパラメータ**](./param-in-path/) -- URLパスから動的セグメントをキャプチャします（例：`/user/:name`）。
- [**クエリ文字列パラメータ**](./querystring-param/) -- リクエストURLからクエリ文字列の値を読み取ります。
- [**クエリとポストフォーム**](./query-and-post-form/) -- 同じハンドラ内でクエリ文字列とPOSTフォームデータの両方にアクセスします。
- [**マップとしてのクエリ文字列またはポストフォーム**](./map-as-querystring-or-postform/) -- クエリ文字列またはPOSTフォームからマップパラメータをバインドします。
- [**Multipart/URLエンコードフォーム**](./multipart-urlencoded-form/) -- `multipart/form-data`と`application/x-www-form-urlencoded`のボディをパースします。
- [**ファイルアップロード**](./upload-file/) -- 単一および複数のファイルアップロードを処理します。
- [**ルートのグルーピング**](./grouping-routes/) -- 共有ミドルウェアを持つ共通プレフィックスの下にルートを整理します。
- [**リダイレクト**](./redirects/) -- HTTPおよびルーターレベルのリダイレクトを実行します。
