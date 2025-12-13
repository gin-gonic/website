---
title: "フォームフィールドのデフォルト値をバインドする"
---

クライアントが値を送信しない場合に、フィールドにデフォルト値を設定したいことがあります。Ginのフォームバインディングは、`form`構造体タグの`default`オプションを通じてデフォルト値をサポートしています。これはスカラー値に対して機能し、Gin v1.11以降では、明示的なコレクションフォーマットを持つコレクション（スライス/配列）にも対応しています。

重要なポイント：

- デフォルト値はフォームキーの直後に配置します: `form:"name,default=William"`。
- コレクションの場合は、`collection_format:"multi|csv|ssv|tsv|pipes"`で値の分割方法を指定します。
- `multi`と`csv`の場合、デフォルト値ではセミコロンを使用して値を区切ります（例：`default=1;2;3`）。Ginは内部的にこれをカンマに変換するため、タグパーサーが曖昧になりません。
- `ssv`（スペース）、`tsv`（タブ）、`pipes`（|）の場合は、デフォルト値に自然な区切り文字を使用します。

例：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: デフォルト値では ; を使用
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // Content-Typeからバインダーを推論
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

ボディなしでPOSTすると、Ginはデフォルト値で応答します：

```sh
curl -X POST http://localhost:8080/person
```

レスポンス（例）：

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

注意事項：

- カンマはGo構造体タグの構文でオプションを区切るために使用されます。デフォルト値内にカンマを含めないでください。
- `multi`と`csv`の場合、セミコロンがデフォルト値を区切ります。これらのフォーマットでは、個々のデフォルト値内にセミコロンを含めないでください。
- 無効な`collection_format`値はバインディングエラーになります。

関連する変更：

- フォームバインディング用のコレクションフォーマット（`multi`、`csv`、`ssv`、`tsv`、`pipes`）はv1.11頃に強化されました。
- コレクションのデフォルト値はv1.11で追加されました（PR #4048）。
