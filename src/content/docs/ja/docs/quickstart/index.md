---
title: "クイックスタート"
sidebar:
  order: 2
---

Ginクイックスタートへようこそ！このガイドでは、Ginのインストール、プロジェクトのセットアップ、最初のAPIの実行までを順を追って説明します。自信を持ってWebサービスの構築を始められるようになります。

## 前提条件

- **Goバージョン**: Ginには[Go](https://go.dev/)バージョン[1.25](https://go.dev/doc/devel/release#go1.25)以上が必要です
- Goが`PATH`に含まれ、ターミナルから使用可能であることを確認してください。Goのインストールについては、[公式ドキュメント](https://go.dev/doc/install)をご覧ください。

---

## ステップ1: Ginのインストールとプロジェクトの初期化

まず、新しいプロジェクトフォルダを作成し、Goモジュールを初期化します：

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Ginを依存関係として追加します：

```sh
go get -u github.com/gin-gonic/gin
```

---

## ステップ2: 最初のGinアプリの作成

`main.go`というファイルを作成します：

```sh
touch main.go
```

`main.go`を開き、以下のコードを追加します：

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
  router.Run() // デフォルトで0.0.0.0:8080でリッスンします
}
```

---

## ステップ3: APIサーバーの実行

以下のコマンドでサーバーを起動します：

```sh
go run main.go
```

ブラウザで[http://localhost:8080/ping](http://localhost:8080/ping)にアクセスすると、以下が表示されるはずです：

```json
{"message":"pong"}
```

---

## 追加の例: net/httpとGinの併用

レスポンスコードに`net/http`の定数を使用したい場合は、それもインポートします：

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

## ヒントとリソース

- Goが初めてですか？[公式Goドキュメント](https://go.dev/doc/code)でGoコードの書き方と実行方法を学びましょう。
- Ginの概念を実践的に学びたいですか？インタラクティブなチャレンジやチュートリアルについては[学習リソース](../learning-resources)をご覧ください。
- フル機能の例が必要ですか？以下のコマンドでスキャフォールドしてみましょう：

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- より詳細なドキュメントについては、[Ginソースコードドキュメント](https://github.com/gin-gonic/gin/blob/master/docs/doc.md)をご覧ください。
