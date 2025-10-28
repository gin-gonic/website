---
title: "クイックスタート"
sidebar:
  order: 2
---

Ginクイックスタートガイドへようこそ！このガイドでは、Ginのインストール、プロジェクトの設定、最初のAPIを作成する手順を分かりやすく紹介します。これにより、安心してWebサービスを構築できます。

## 必要条件

- **Go**: バージョン1.23以上がインストールされている必要があります。
- Goがあなたの`PATH`に含まれ、ターミナルから使用できることを確認してください。インストールに困った場合は[公式ドキュメント](https://golang.org/doc/install)をご覧ください。

---

## ステップ1: Ginのインストールとプロジェクトの初期化

まず、新しいプロジェクトフォルダを作成し、Goモジュールを初期化します：

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Ginパッケージを依存関係に追加します：

```sh
go get -u github.com/gin-gonic/gin
```

---

## ステップ2: Ginアプリの作成

`main.go`というファイルを作成します：

```sh
touch main.go
```

`main.go`を開いて、次のコードを追加してください：

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
  router.Run() // デフォルトで0.0.0.0:8080で待機します
}
```

---

## ステップ3: APIサーバの起動

次のコマンドでサーバを起動します：

```sh
go run main.go
```

ブラウザで[http://localhost:8080/ping](http://localhost:8080/ping)にアクセスすると、以下が表示されます：

```json
{"message":"pong"}
```

---

## 追加例: Ginでnet/httpを使う

レスポンスコードに`net/http`の定数を使いたい場合は、インポートしてください：

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
  router.Run()
}
```

---

## ヒント & リソース

- Goの初心者ですか？Goコードの書き方と実行方法は[こちら](https://golang.org/doc/code.html)。
- Ginの概念を実践的に学びたいですか？インタラクティブなチャレンジとチュートリアルのために[学習リソース](../learning-resources)をご覧ください。
- もっと詳しいサンプルが必要なら、次のコマンドを使用してください：

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- 詳しいドキュメントは[Gin公式ドキュメント](https://github.com/gin-gonic/gin/blob/master/docs/doc.md)をご覧ください。
