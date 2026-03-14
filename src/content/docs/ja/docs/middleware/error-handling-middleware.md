---
title: "エラーハンドリングミドルウェア"
sidebar:
  order: 4
---

典型的なRESTfulアプリケーションでは、あらゆるルートで次のようなエラーが発生する可能性があります：

- ユーザーからの無効な入力
- データベースの障害
- 不正なアクセス
- 内部サーバーバグ

デフォルトでは、Ginは`c.Error(err)`を使用して各ルートでエラーを手動で処理できます。
しかし、これはすぐに繰り返しが多く、一貫性のないものになりがちです。

この問題を解決するために、カスタムミドルウェアを使用してすべてのエラーを一箇所で処理できます。
このミドルウェアは各リクエストの後に実行され、Ginコンテキスト（`c.Errors`）に追加されたエラーをチェックします。
エラーが見つかった場合、適切なステータスコード付きの構造化されたJSONレスポンスを送信します。

#### 例

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandlerはエラーをキャプチャし、一貫したJSONエラーレスポンスを返します
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // ステップ1: まずリクエストを処理。

        // ステップ2: コンテキストにエラーが追加されたかチェック
        if len(c.Errors) > 0 {
            // ステップ3: 最後のエラーを使用
            err := c.Errors.Last().Err

            // ステップ4: 汎用エラーメッセージで応答
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // エラーが見つからない場合のその他のステップ
    }
}

func main() {
    r := gin.Default()

    // エラーハンドリングミドルウェアを登録
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

- エラーをステータスコードにマッピング
- エラーコードに基づいて異なるエラーレスポンスを生成
- エラーをロギング

#### エラーハンドリングミドルウェアの利点

- **一貫性**: すべてのエラーが同じフォーマットに従う
- **クリーンなルート**: ビジネスロジックがエラーフォーマットから分離される
- **重複の削減**: すべてのハンドラでエラーハンドリングロジックを繰り返す必要がない
