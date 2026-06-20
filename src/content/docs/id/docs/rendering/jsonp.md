---
title: "JSONP"
sidebar:
  order: 3
---

JSONP (JSON with Padding) adalah teknik untuk membuat permintaan cross-domain dari browser yang belum mendukung CORS. Cara kerjanya adalah membungkus respons JSON dalam pemanggilan fungsi JavaScript. Browser memuat respons melalui tag `<script>`, yang tidak tunduk pada kebijakan same-origin, dan fungsi pembungkus dieksekusi dengan data sebagai argumennya.

Ketika Anda memanggil `c.JSONP()`, Gin memeriksa parameter query `callback`. Jika ada, body respons dibungkus sebagai `callbackName({"foo":"bar"})` dengan `Content-Type` berupa `application/javascript`. Jika tidak ada callback, respons berperilaku seperti pemanggilan `c.JSON()` standar.

:::note
JSONP adalah teknik lama. Untuk aplikasi modern, gunakan [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) sebagai gantinya. CORS lebih aman, mendukung semua metode HTTP (bukan hanya GET), dan tidak memerlukan pembungkusan respons dalam callback. Gunakan JSONP hanya ketika Anda perlu mendukung browser sangat lama atau mengintegrasikan dengan sistem pihak ketiga yang memerlukannya.
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/JSONP", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // The callback name is read from the query string, e.g.:
    // GET /JSONP?callback=x
    // Will output  :   x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

Uji dengan curl untuk melihat perbedaan antara respons JSONP dan JSON biasa:

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[Pertimbangan keamanan]
Endpoint JSONP dapat rentan terhadap serangan XSS jika parameter callback tidak disanitasi dengan benar. Nilai callback berbahaya seperti `alert(document.cookie)//` dapat menyuntikkan JavaScript sembarang. Gin memitigasi ini dengan menyanitasi nama callback, menghapus karakter yang dapat digunakan untuk injeksi. Namun, Anda tetap harus membatasi endpoint JSONP hanya untuk data non-sensitif dan read-only, karena halaman mana pun di web dapat memuat endpoint JSONP Anda melalui tag `<script>`.
:::

## Lihat juga

- [Rendering XML/JSON/YAML/ProtoBuf](/id/docs/rendering/rendering/)
- [SecureJSON](/id/docs/rendering/secure-json/)
- [AsciiJSON](/id/docs/rendering/ascii-json/)
- [PureJSON](/id/docs/rendering/pure-json/)
