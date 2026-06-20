---
title: "ファイルからのデータ配信"
sidebar:
  order: 7
---

Ginはクライアントにファイルを配信するためのいくつかのメソッドを提供しています。各メソッドは異なるユースケースに適しています：

- **`c.File(path)`** -- ローカルファイルシステムからファイルを配信します。コンテンツタイプは自動検出されます。コンパイル時にファイルパスが分かっている場合や、すでにバリデーション済みの場合に使用します。
- **`c.FileFromFS(path, fs)`** -- `http.FileSystem`インターフェースからファイルを配信します。埋め込みファイルシステム（`embed.FS`）、カスタムストレージバックエンド、または特定のディレクトリツリーへのアクセスを制限したい場合に便利です。
- **`c.FileAttachment(path, filename)`** -- `Content-Disposition: attachment`ヘッダーを設定してダウンロードとしてファイルを配信します。ブラウザはディスク上の元のファイル名に関係なく、指定したファイル名でファイルの保存を促します。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // ファイルをインラインで配信（ブラウザに表示）
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // http.FileSystemからファイルを配信
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // カスタムファイル名でダウンロード可能な添付ファイルとして配信
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

curlでダウンロードエンドポイントをテストできます：

```sh
# -vフラグでContent-Dispositionヘッダーを表示
curl -v http://localhost:8080/download --output report.xlsx

# ファイルをインラインで配信
curl http://localhost:8080/local/file
```

`io.Reader`からのデータストリーミング（リモートURLや動的に生成されるコンテンツなど）については、代わりに`c.DataFromReader()`を使用してください。詳細は[リーダーからのデータ配信](/ja/docs/rendering/serving-data-from-reader/)をご覧ください。

:::caution[セキュリティ：パストラバーサル]
ユーザー入力を`c.File()`や`c.FileAttachment()`に直接渡さないでください。攻撃者は`../../etc/passwd`のようなパスを指定してサーバー上の任意のファイルを読み取る可能性があります。常にファイルパスをバリデーションおよびサニタイズするか、特定のディレクトリへのアクセスを制限する`http.FileSystem`と`c.FileFromFS()`を使用してください。

```go
// 危険 -- 絶対にこうしないでください
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // 攻撃者がパスを制御
})

// 安全 -- 特定のディレクトリに制限
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
