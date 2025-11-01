---
title: "Bind default values for form fields"
---

Sometimes you want a field to fall back to a default when the client doesn't send a value. Gin's form binding supports defaults via the `default` option in the `form` struct tag. This works for scalars and, starting in Gin v1.11, for collections (slices/arrays) with explicit collection formats.

Key points:

- Put the default right after the form key: `form:"name,default=William"`.
- For collections, specify how to split values with `collection_format:"multi|csv|ssv|tsv|pipes"`.
- For `multi` and `csv`, use semicolons in the default to separate values (e.g., `default=1;2;3`). Gin converts these to commas internally so the tag parser remains unambiguous.
- For `ssv` (space), `tsv` (tab), and `pipes` (|), use the natural separator in the default.

Example:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: use ; in defaults
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // infers binder by Content-Type
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

If you POST without any body, Gin responds with the defaults:

```sh
curl -X POST http://localhost:8080/person
```

Response (example):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

Notes and caveats:

- Commas are used by Go struct tag syntax to separate options; avoid commas inside default values.
- For `multi` and `csv`, semicolons separate default values; don't include semicolons inside individual defaults for these formats.
- Invalid `collection_format` values will result in a binding error.

Related changes:

- Collection formats for form binding (`multi`, `csv`, `ssv`, `tsv`, `pipes`) were enhanced around v1.11.
- Default values for collections were added in v1.11 (PR #4048).
