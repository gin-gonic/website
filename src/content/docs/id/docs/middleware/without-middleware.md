---
title: "Tanpa middleware secara default"
sidebar:
  order: 1
---

Gin menawarkan dua cara untuk membuat engine router, dan perbedaannya terletak pada middleware apa yang dipasang secara default.

### `gin.Default()` -- dengan Logger dan Recovery

`gin.Default()` membuat router dengan dua middleware yang sudah terpasang:

- **Logger** -- Menulis log permintaan ke stdout (metode, path, kode status, latensi).
- **Recovery** -- Memulihkan dari panic dalam handler dan mengembalikan respons 500, mencegah server Anda crash.

Ini adalah pilihan paling umum untuk memulai dengan cepat.

### `gin.New()` -- engine kosong

`gin.New()` membuat router yang benar-benar kosong **tanpa middleware** yang terpasang. Ini berguna ketika Anda ingin kontrol penuh atas middleware yang berjalan, misalnya:

- Anda ingin menggunakan logger terstruktur (seperti `slog` atau `zerolog`) alih-alih logger teks default.
- Anda ingin menyesuaikan perilaku recovery panic.
- Anda sedang membangun microservice di mana Anda membutuhkan stack middleware yang minimal atau khusus.

### Contoh

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a blank engine with no middleware.
  r := gin.New()

  // Attach only the middleware you need.
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  log.Fatal(r.Run(":8080"))
}
```

Dalam contoh di atas, middleware Recovery disertakan untuk mencegah crash, tetapi middleware Logger default dihilangkan. Anda dapat menggantinya dengan middleware logging Anda sendiri atau menghilangkannya sepenuhnya.
