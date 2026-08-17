---
title: "Bind header"
sidebar:
  order: 9
---

`ShouldBindHeader` melakukan bind header permintaan HTTP langsung ke struct menggunakan tag struct `header`. Ini berguna untuk mengekstrak metadata seperti pembatasan laju API, token autentikasi, atau header domain tersuai dari permintaan yang masuk.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type testHeader struct {
  Rate   int    `header:"Rate"`
  Domain string `header:"Domain"`
}

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    h := testHeader{}

    if err := c.ShouldBindHeader(&h); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run(":8080")
}
```

## Uji coba

```sh
# Melewatkan header tersuai
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Tanpa header — nilai nol digunakan
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
Nama header bersifat case-insensitive sesuai spesifikasi HTTP. Nilai tag struct `header` dicocokkan secara case-insensitive, jadi `header:"Rate"` akan cocok dengan header yang dikirim sebagai `Rate`, `rate`, atau `RATE`.
:::

:::tip
Anda dapat mengkombinasikan tag `header` dengan `binding:"required"` untuk menolak permintaan yang tidak memiliki header yang diperlukan:

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## Lihat juga

- [Binding dan validasi](/id/docs/binding/binding-and-validation/)
- [Bind query string atau post data](/id/docs/binding/bind-query-or-post/)
