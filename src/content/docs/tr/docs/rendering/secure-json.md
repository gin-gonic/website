---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON`, **JSON ele geçirme** olarak bilinen bir güvenlik açığı sınıfına karşı koruma sağlar. Eski tarayıcılarda (öncelikle Internet Explorer 9 ve öncesi), kötü niyetli bir sayfa, kurbanın JSON API uç noktasına işaret eden bir `<script>` etiketi ekleyebilirdi. Bu uç nokta üst düzey bir JSON dizisi döndürdüyse (ör., `["gizli","veri"]`), tarayıcı bunu JavaScript olarak çalıştırırdı. `Array` yapıcısını geçersiz kılarak, saldırgan ayrıştırılmış değerleri yakalayabilir ve hassas verileri üçüncü taraf bir sunucuya sızdırabilirdi.

**SecureJSON bunu nasıl önler:**

Yanıt verisi bir JSON dizisi olduğunda, `SecureJSON` yanıt gövdesine ayrıştırılamaz bir ön ek ekler -- varsayılan olarak `while(1);`. Bu, yanıt bir `<script>` etiketi aracılığıyla yüklenirse tarayıcının JavaScript motorunun sonsuz döngüye girmesine neden olarak verilere erişimi engeller. Meşru API tüketicileri ((`fetch`, `XMLHttpRequest` veya herhangi bir HTTP istemcisi kullanan) ham yanıt gövdesini okur ve ayrıştırmadan önce ön eki kolayca kaldırabilir.

Google'ın API'leri `)]}'\n` ile benzer bir teknik kullanır ve Facebook `for(;;);` kullanır. Ön eki `router.SecureJsonPrefix()` ile özelleştirebilirsiniz.

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
Modern tarayıcılar bu güvenlik açığını düzeltmiştir, bu nedenle `SecureJSON` öncelikle eski tarayıcıları desteklemeniz gerektiğinde veya güvenlik politikanız derinlemesine savunma gerektirdiğinde geçerlidir. Çoğu yeni API için standart `c.JSON()` yeterlidir.
:::
