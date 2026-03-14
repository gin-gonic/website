---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON` melindungi dari kelas kerentanan yang dikenal sebagai **JSON hijacking**. Di browser lama (terutama Internet Explorer 9 dan sebelumnya), halaman berbahaya dapat menyertakan tag `<script>` yang mengarah ke endpoint JSON API korban. Jika endpoint tersebut mengembalikan array JSON tingkat atas (mis., `["secret","data"]`), browser akan mengeksekusinya sebagai JavaScript. Dengan menimpa konstruktor `Array`, penyerang dapat mencegat nilai yang di-parse dan membocorkan data sensitif ke server pihak ketiga.

**Bagaimana SecureJSON mencegah ini:**

Ketika data respons adalah array JSON, `SecureJSON` menambahkan prefix yang tidak dapat di-parse -- secara default `while(1);` -- ke body respons. Ini menyebabkan mesin JavaScript browser masuk ke loop tak terbatas jika respons dimuat melalui tag `<script>`, mencegah data diakses. Konsumen API yang sah (menggunakan `fetch`, `XMLHttpRequest`, atau klien HTTP apa pun) membaca body respons mentah dan cukup menghapus prefix sebelum mem-parse.

API Google menggunakan teknik serupa dengan `)]}'\n`, dan Facebook menggunakan `for(;;);`. Anda dapat menyesuaikan prefix dengan `router.SecureJsonPrefix()`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // You can also use your own secure json prefix
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // Will output  :   while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
Browser modern telah memperbaiki kerentanan ini, jadi `SecureJSON` terutama relevan jika Anda perlu mendukung browser lama atau jika kebijakan keamanan Anda memerlukan pertahanan berlapis. Untuk sebagian besar API baru, `c.JSON()` standar sudah cukup.
:::
