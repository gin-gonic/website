---
title: "HTTPメソッドの使用"
sidebar:
  order: 1
---

GinはHTTP動詞に直接マッピングするメソッドを提供しており、RESTful APIの構築が簡単です。各メソッドは対応するHTTPリクエストタイプにのみ応答するルートを登録します：

| メソッド      | 一般的なREST用途                      |
| ----------- | ----------------------------------- |
| **GET**     | リソースの取得                        |
| **POST**    | 新しいリソースの作成                    |
| **PUT**     | 既存のリソースの置換                    |
| **PATCH**   | 既存のリソースの部分更新                |
| **DELETE**  | リソースの削除                        |
| **HEAD**    | GETと同じだがボディなし                |
| **OPTIONS** | 通信オプションの説明                    |

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "GET"})
}

func posting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "POST"})
}

func putting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PUT"})
}

func deleting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "DELETE"})
}

func patching(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PATCH"})
}

func head(c *gin.Context) {
	c.Status(http.StatusOK)
}

func options(c *gin.Context) {
	c.Status(http.StatusOK)
}

func main() {
	// デフォルトミドルウェアを含むginルーターを作成：
	// loggerとrecovery（クラッシュフリー）ミドルウェア
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// デフォルトでは:8080でサーブします（PORT環境変数が
	// 定義されていない場合）。
	router.Run()
	// router.Run(":3000") でポートをハードコード
}
```

### curlでのテスト

サーバーが起動したら、各エンドポイントをテストできます：

```sh
# GETリクエスト
curl -X GET http://localhost:8080/someGet

# POSTリクエスト
curl -X POST http://localhost:8080/somePost

# PUTリクエスト
curl -X PUT http://localhost:8080/somePut

# DELETEリクエスト
curl -X DELETE http://localhost:8080/someDelete

# PATCHリクエスト
curl -X PATCH http://localhost:8080/somePatch

# HEADリクエスト（ヘッダーのみ返却、ボディなし）
curl -I http://localhost:8080/someHead

# OPTIONSリクエスト
curl -X OPTIONS http://localhost:8080/someOptions
```

## 関連項目

- [パス内のパラメータ](/ja/docs/routing/param-in-path/)
- [ルートのグルーピング](/ja/docs/routing/grouping-routes/)
- [クエリ文字列パラメータ](/ja/docs/routing/querystring-param/)
