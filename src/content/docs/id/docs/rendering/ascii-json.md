---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON` menyerialisasi data ke JSON tetapi meng-escape semua karakter non-ASCII menjadi sequence escape Unicode `\uXXXX`. Karakter khusus HTML seperti `<` dan `>` juga di-escape. Hasilnya adalah body respons yang hanya berisi karakter ASCII 7-bit.

**Kapan menggunakan AsciiJSON:**

- Konsumen API Anda memerlukan respons yang ketat hanya ASCII (misalnya, sistem yang tidak dapat menangani byte berenkode UTF-8).
- Anda perlu menyematkan JSON di dalam konteks yang hanya mendukung ASCII, seperti sistem logging tertentu atau transportasi lama.
- Anda ingin memastikan karakter seperti `<`, `>`, dan `&` di-escape untuk menghindari masalah injeksi ketika JSON disematkan dalam HTML.

Untuk sebagian besar API modern, `c.JSON()` standar sudah cukup karena menghasilkan UTF-8 yang valid. Gunakan `AsciiJSON` hanya ketika keamanan ASCII adalah persyaratan spesifik.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/someJSON", func(c *gin.Context) {
    data := map[string]interface{}{
      "lang": "GO语言",
      "tag":  "<br>",
    }

    // will output : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

Anda dapat menguji endpoint ini dengan curl:

```bash
curl http://localhost:8080/someJSON
# Output: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

Perhatikan bahwa karakter Cina `语言` diganti dengan `\u8bed\u8a00`, dan tag `<br>` menjadi `\u003cbr\u003e`. Body respons aman untuk dikonsumsi di lingkungan yang hanya mendukung ASCII.
