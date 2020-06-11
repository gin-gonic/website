---
title: "クイックスタート"
draft: false
weight: 2
---

このクイックスタートでは、コードの集まりからの洞察を収集し、どのようにするかを学びます。

## 要件

- Gin を利用するには Go 1.9 以上が必要です。

> Go 1.7とGo 1.8は、まもなくサポートされなくなります。

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

1. プロジェクトフォルダを作り、 `cd` で中に入ります。

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

2. 開始用テンプレートをプロジェクトディレクトリにコピーする

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

3. プロジェクトを実行する

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
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // 0.0.0.0:8080 でサーバーを立てます。
}
```

そして `go run example.go` でコードを実行します。

```
# example.go を実行し、ブラウザで 0.0.0.0:8080/ping にアクセスする
$ go run example.go
```
