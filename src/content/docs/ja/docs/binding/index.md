---
title: "バインディング"
sidebar:
  order: 4
---

Ginは、リクエストデータをGoの構造体にパースし、自動的にバリデーションする強力なバインディングシステムを提供します。`c.PostForm()`を手動で呼び出したり`c.Request.Body`を読み取ったりする代わりに、タグ付きの構造体を定義してGinに処理を任せることができます。

## BindとShouldBind

Ginは2つのファミリーのバインディングメソッドを提供しています：

| メソッド | エラー時 | 使用場面 |
|--------|----------|----------|
| `c.Bind`、`c.BindJSON`など | 自動的に`c.AbortWithError(400, err)`を呼び出す | Ginにエラーレスポンスを処理させたい場合 |
| `c.ShouldBind`、`c.ShouldBindJSON`など | エラーを返し、自分で処理する | カスタムエラーレスポンスが必要な場合 |

ほとんどの場合、エラーハンドリングをより制御できる**`ShouldBind`を推奨**します。

## 簡単な例

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBindはContent-Typeをチェックしてバインディングエンジンを自動選択します
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## サポートされるフォーマット

Ginは多くのソースからデータをバインドできます：**JSON**、**XML**、**YAML**、**TOML**、**フォームデータ**（URLエンコードおよびmultipart）、**クエリ文字列**、**URIパラメータ**、**ヘッダー**。適切な構造体タグ（`json`、`xml`、`yaml`、`form`、`uri`、`header`）を使用してフィールドをマッピングします。バリデーションルールは`binding`タグに記述し、[go-playground/validator](https://github.com/go-playground/validator)の構文を使用します。

## このセクションの内容

- [**モデルバインディングとバリデーション**](./binding-and-validation/) -- バインディングの基本概念とバリデーションルール
- [**カスタムバリデータ**](./custom-validators/) -- 独自のバリデーション関数を登録する
- [**クエリ文字列またはポストデータのバインド**](./bind-query-or-post/) -- クエリ文字列とフォームボディからバインドする
- [**URIのバインド**](./bind-uri/) -- パスパラメータを構造体にバインドする
- [**ヘッダーのバインド**](./bind-header/) -- HTTPヘッダーを構造体にバインドする
- [**デフォルト値**](./default-value/) -- 欠落フィールドのフォールバック値を設定する
- [**コレクションフォーマット**](./collection-format/) -- 配列クエリパラメータを処理する
- [**カスタムアンマーシャラー**](./custom-unmarshaler/) -- カスタムデシリアライゼーションロジックを実装する
- [**HTMLチェックボックスのバインド**](./bind-html-checkboxes/) -- チェックボックスフォーム入力を処理する
- [**Multipart/URLエンコードバインディング**](./multipart-urlencoded-binding/) -- multipartフォームデータをバインドする
- [**カスタム構造体タグ**](./custom-struct-tag/) -- フィールドマッピングにカスタム構造体タグを使用する
- [**ボディを異なる構造体にバインドする**](./bind-body-into-different-structs/) -- リクエストボディを複数回パースする
