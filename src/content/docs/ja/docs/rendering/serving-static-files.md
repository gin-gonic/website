---
title: "静的ファイルの配信"
sidebar:
  order: 6
---

Ginは静的コンテンツを配信するための3つのメソッドを提供しています：

- **`router.Static(relativePath, root)`** -- ディレクトリ全体を配信します。`relativePath`へのリクエストは`root`配下のファイルにマッピングされます。例えば、`router.Static("/assets", "./assets")`は`./assets/style.css`を`/assets/style.css`で配信します。
- **`router.StaticFS(relativePath, fs)`** -- `Static`と同様ですが、`http.FileSystem`インターフェースを受け取り、ファイルの解決方法をより細かく制御できます。埋め込みファイルシステムからファイルを配信する場合や、ディレクトリリスティングの動作をカスタマイズしたい場合に使用します。
- **`router.StaticFile(relativePath, filePath)`** -- 単一のファイルを配信します。`/favicon.ico`や`/robots.txt`のようなエンドポイントに便利です。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```

:::caution[セキュリティ：パストラバーサル]
`Static()`や`http.Dir()`に渡すディレクトリは、すべてのクライアントから完全にアクセス可能になります。設定ファイル、`.env`ファイル、秘密鍵、データベースファイルなどの機密ファイルが含まれていないことを確認してください。

ベストプラクティスとして：

- 公開する予定のファイルのみを含む専用ディレクトリを使用してください。
- プロジェクト全体やファイルシステムを公開する可能性のある`"."`や`"/"`などのパスを渡すことを避けてください。
- より細かい制御が必要な場合（例：ディレクトリリスティングの無効化）は、カスタム`http.FileSystem`実装で`StaticFS`を使用してください。標準の`http.Dir`はデフォルトでディレクトリリスティングを有効にしています。
:::
