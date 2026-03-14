---
title: "レンダリング"
sidebar:
  order: 5
---

Ginは、JSON、XML、YAML、ProtoBuf、HTMLなど、複数のフォーマットでのレスポンスレンダリングをサポートしています。すべてのレンダリングメソッドは同じパターンに従います：`*gin.Context`のメソッドにHTTPステータスコードとシリアライズするデータを渡して呼び出します。Ginはコンテンツタイプヘッダー、シリアライズ、レスポンスの書き込みを自動的に処理します。

```go
// すべてのレンダリングメソッドはこのパターンに従います：
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

`Accept`ヘッダーやクエリパラメータを使用して、単一のハンドラから同じデータを複数のフォーマットで提供できます：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/user", func(c *gin.Context) {
    user := gin.H{"name": "Lena", "role": "admin"}

    switch c.Query("format") {
    case "xml":
      c.XML(http.StatusOK, user)
    case "yaml":
      c.YAML(http.StatusOK, user)
    default:
      c.JSON(http.StatusOK, user)
    }
  })

  router.Run(":8080")
}
```

## このセクションの内容

- [**XML/JSON/YAML/ProtoBufレンダリング**](./rendering/) -- 自動コンテンツタイプ処理で複数のフォーマットでレスポンスをレンダリング
- [**SecureJSON**](./secure-json/) -- レガシーブラウザでのJSONハイジャック攻撃を防止
- [**JSONP**](./jsonp/) -- CORSなしでレガシークライアントからのクロスドメインリクエストをサポート
- [**AsciiJSON**](./ascii-json/) -- 安全な転送のために非ASCII文字をエスケープ
- [**PureJSON**](./pure-json/) -- HTML文字をエスケープせずにJSONをレンダリング
- [**静的ファイルの配信**](./serving-static-files/) -- 静的アセットのディレクトリを配信
- [**ファイルからのデータ配信**](./serving-data-from-file/) -- 個別のファイル、添付ファイル、ダウンロードを配信
- [**リーダーからのデータ配信**](./serving-data-from-reader/) -- 任意の`io.Reader`からレスポンスにデータをストリーミング
- [**HTMLレンダリング**](./html-rendering/) -- 動的データでHTMLテンプレートをレンダリング
- [**マルチテンプレート**](./multiple-template/) -- 単一のアプリケーションで複数のテンプレートセットを使用
- [**テンプレートを単一バイナリにバインド**](./bind-single-binary-with-template/) -- テンプレートをコンパイル済みバイナリに埋め込む
