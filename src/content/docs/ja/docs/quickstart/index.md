---
sidebar:
  order: 2
title: クイックスタート
---

このクイックスタートでは、コードの集まりからの洞察を収集し、どのようにするかを学びます。

## 要件

- Gin を利用するには Go 1.16 以上が必要です。

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

4. プロジェクトフォルダを作り、 `cd` で中に入ります。

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

5. 開始用テンプレートをプロジェクトディレクトリにコピーする

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

6. プロジェクトを実行する

```sh
$ go run main.go
```

## Getting Started

> Go のコードを書いて実行する方法がわからない？ [ここをクリックしてください](https://golang.org/doc/code.html).

まず、`example.go` を作成します。

```sh
# 後述のコードが、example.go のファイルにあるとします。
$ touch example.go
```

次に、下記のコードを `example.go` に書きます。

```go
package main

import "github.com/gin-gonic/gin"

func main() {
	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	router.Run() // 0.0.0.0:8080 でサーバーを立てます。
}
```

そして `go run example.go` でコードを実行します。

```sh
# example.go を実行し、ブラウザで 0.0.0.0:8080/ping にアクセスする
$ go run example.go
```

If you prefer to use the `net/http` package, follow the code snippet below

```go
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })

  router.Run() // listen and serve on 0.0.0.0:8080
}
```

Additional information is available from the [Gin source code
repository](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).
