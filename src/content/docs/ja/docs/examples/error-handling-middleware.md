---
title: エラー制御ミドルウェア
---

典型的なRESTfulアプリケーションでは、以下のようなルートだと、何れもエラーになるでしょう。

- 利用者からの不正な入力
- データベースの失敗
- 権限のないアクセス
- 内部的なサーバーの不具合

既定では、`c.Error(err)`を使い、それぞれのルートのエラーを手作業で扱うことができます。
しかし、こうするのは反復的で、一貫性のないものになりがちです。

これを解決するため、一括で全てのエラーを扱う独自のミドルウェアが使えます。
このミルドウェアはそれぞれのリクエストの後に走り、Gin の Context に加えられたエラー (`c.Errors`) がないか検査します。
何か見付けたら、適切なステータスコードを持つ、構造化されたJSONのレスポンスを送ります。

#### 例

```go
import (
	"errors"
	"net/http"
	"github.com/gin-gonic/gin"
)

// ErrorHandlerはエラーを捕捉し、一貫性のあるJSONのエラーレスポンスを返します
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // 工程1：まずはリクエストを処理。

        // 工程2：Contextにエラーが加えられていないか判定
        if len(c.Errors) > 0 {
            // 工程3：最後のエラーを使用
            err := c.Errors.Last().Err

            // 工程4：一般的なエラーメッセージでレスポンス
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // 何もエラーが見付からなければ、何かしらの工程がここにきます
    }
}

func main() {
    r := gin.Default()

    // エラー制御ミドルウェアを設置
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("問題が発生しました"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "上手く行きました！",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("問題が発生しました"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "上手く行きました！",
        })
    })

    r.Run()
}

```

#### 拡張

- エラーをステータスコードに対応付ける
- エラーコードを元に個別のエラーレスポンスを生成
- ログのエラーを使用

#### エラー制御ミドルウェアの利点

- **一貫性**：全てのエラーが同じ形式に従います
- **明快なルート**：ビジネスロジックがエラーの書式化とは区別されます
- **重複の低減**：毎回ハンドラでエラー制御の仕組みを繰り返さなくて良くなります
