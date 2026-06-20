---
title: "リーダーからのデータ配信"
sidebar:
  order: 8
---

`DataFromReader`を使用すると、コンテンツ全体をメモリにバッファリングすることなく、任意の`io.Reader`からHTTPレスポンスに直接データをストリーミングできます。これはプロキシエンドポイントの構築やリモートソースからの大容量ファイルを効率的に配信するために不可欠です。

**一般的なユースケース：**

- **リモートリソースのプロキシ** -- 外部サービス（クラウドストレージAPIやCDNなど）からファイルを取得してクライアントに転送します。データはメモリに完全にロードされることなくサーバーを通過します。
- **生成コンテンツの配信** -- 動的に生成されるデータ（CSVエクスポートやレポートファイルなど）を生成しながらストリーミングします。
- **大容量ファイルのダウンロード** -- メモリに保持するには大きすぎるファイルを、ディスクやリモートソースからチャンク単位で読み取りながら配信します。

メソッドシグネチャは`c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`です。HTTPステータスコード、コンテンツ長（クライアントが合計サイズを把握するため）、MIMEタイプ、ストリーミング元の`io.Reader`、およびオプションの追加レスポンスヘッダーマップ（ファイルダウンロード用の`Content-Disposition`など）を提供します。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

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

この例では、GinはGitHubから画像を取得し、ダウンロード可能な添付ファイルとしてクライアントに直接ストリーミングします。画像のバイトはアップストリームのHTTPレスポンスボディからクライアントレスポンスへバッファに蓄積されることなく流れます。`DataFromReader`がレスポンス書き込み中に読み取りを完了するため、`response.Body`はハンドラが戻った後にHTTPサーバーによって自動的にクローズされます。
