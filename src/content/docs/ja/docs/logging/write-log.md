---
title: "ログファイルの書き方"
sidebar:
  order: 1
---

ログをファイルに書き込むことは、デバッグ、監査、モニタリングのためにリクエスト履歴を保持する必要がある本番アプリケーションにとって不可欠です。デフォルトでは、Ginはすべてのログ出力を`os.Stdout`に書き込みます。ルーターを作成する前に`gin.DefaultWriter`を設定することで、これをリダイレクトできます。

```go
package main

import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
    // コンソールの色を無効にします。ログをファイルに書き込む場合、コンソールカラーは不要です。
    gin.DisableConsoleColor()

    // ファイルにロギング。
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // ログをファイルとコンソールに同時に書き込みたい場合は、以下のコードを使用してください。
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### ファイルとコンソールへの同時書き込み

Go標準ライブラリの`io.MultiWriter`関数は複数の`io.Writer`値を受け取り、すべてに対して書き込みを複製します。これは開発中にターミナルでログを確認しながらディスクにも永続化したい場合に便利です：

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

この設定により、すべてのログエントリが`gin.log`とコンソールの両方に同時に書き込まれます。

### 本番環境でのログローテーション

上記の例では`os.Create`を使用しており、アプリケーションが起動するたびにログファイルが切り詰められます。本番環境では通常、既存のログに追加し、サイズや時間に基づいてファイルをローテーションしたいものです。[lumberjack](https://github.com/natefinch/lumberjack)などのログローテーションライブラリの使用を検討してください：

```go
import "gopkg.in/natefinch/lumberjack.v2"

func main() {
    gin.DisableConsoleColor()

    gin.DefaultWriter = &lumberjack.Logger{
        Filename:   "gin.log",
        MaxSize:    100, // メガバイト
        MaxBackups: 3,
        MaxAge:     28, // 日数
    }

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### 関連項目

- [カスタムログフォーマット](../custom-log-format/) -- 独自のログ行フォーマットを定義する。
- [ログ出力の色付け制御](../controlling-log-output-coloring/) -- カラー出力を無効にするか強制する。
- [ロギングのスキップ](../skip-logging/) -- 特定のルートをロギングから除外する。
