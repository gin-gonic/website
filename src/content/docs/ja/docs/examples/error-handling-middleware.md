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
このミルドウェアはそれぞれの要求の後に走り、Ginの文脈 (`c.Errors`) に加えられたエラーがないか検査します。
何か見付けたら、適切な状態コードを持つ、構造化されたJSONの応答を送ります。

#### 例

```go
import (
	"errors"
	"net/http"
	"github.com/gin-gonic/gin"
)

// ErrorHandlerはエラーを捕捉し、一貫性のあるJSONのエラー応答を返します
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // 工程1：まずは要求を処理。

        // 工程2：文脈にエラーが加えられていないか判定
        if len(c.Errors) > 0 {
            // 工程3：最後のエラーを使用
            err := c.Errors.Last().Err

            // 工程4：一般的なエラー伝文で応答
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
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### 拡張

- エラーを状態コードに対応付ける
- エラーコードを元に個別のエラー応答を生成
- ログのエラーを使用

#### エラー制御ミドルウェアの利点

- **一貫性**：全てのエラーが同じ形式に従います
- **明快なルート**：本質的な仕組みはエラーの書式化とは区別されます
- **重複の低減**：毎回ハンドラでエラー制御の仕組みを繰り返さなくて良くなります
