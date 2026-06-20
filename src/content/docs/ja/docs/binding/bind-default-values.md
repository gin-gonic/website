---
title: "フォームフィールドのデフォルト値バインド"
sidebar:
  order: 5
---

クライアントが値を送信しない場合にフィールドをデフォルト値にフォールバックさせたいことがあります。Ginのフォームバインディングは`form`構造体タグの`default`オプションによるデフォルト値をサポートしています。これはスカラー値に対して機能し、Gin v1.11以降ではコレクション（スライス/配列）にも明示的なコレクションフォーマットで対応しています。

重要なポイント：

- デフォルト値はフォームキーの直後に配置します：`form:"name,default=William"`。
- コレクションの場合は、`collection_format:"multi|csv|ssv|tsv|pipes"`で値の分割方法を指定します。
- `multi`と`csv`では、デフォルト内でセミコロンを使用して値を区切ります（例：`default=1;2;3`）。Ginはタグパーサーが曖昧にならないよう、内部的にこれらをカンマに変換します。
- `ssv`（スペース）、`tsv`（タブ）、`pipes`（|）では、デフォルト内で自然な区切り文字を使用します。

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
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: デフォルトにはセミコロンを使用
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // Content-Typeでバインダーを推測
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

- Goの構造体タグ構文ではカンマがオプションの区切りに使用されるため、デフォルト値内でのカンマの使用は避けてください。
- `multi`と`csv`ではセミコロンがデフォルト値の区切りとなるため、これらのフォーマットでは個々のデフォルト値内にセミコロンを含めないでください。
- 無効な`collection_format`値はバインディングエラーになります。

関連する変更：

- フォームバインディングのコレクションフォーマット（`multi`、`csv`、`ssv`、`tsv`、`pipes`）はv1.11頃に強化されました。
- コレクションのデフォルト値はv1.11で追加されました（PR #4048）。
