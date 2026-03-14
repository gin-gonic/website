---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON`, veriyi JSON'a serileştirir ancak tüm ASCII olmayan karakterleri `\uXXXX` Unicode kaçış dizilerine dönüştürür. `<` ve `>` gibi HTML-özel karakterler de kaçışlanır. Sonuç, yalnızca 7-bit ASCII karakterleri içeren bir yanıt gövdesidir.

**AsciiJSON ne zaman kullanılır:**

- API tüketicileriniz kesinlikle ASCII güvenli yanıtlar gerektiriyorsa (örneğin, UTF-8 kodlu baytları işleyemeyen sistemler).
- JSON'u yalnızca ASCII'yi destekleyen bağlamlara yerleştirmeniz gerekiyorsa, örneğin belirli loglama sistemleri veya eski aktarım yolları.
- JSON HTML'ye gömüldüğünde enjeksiyon sorunlarını önlemek için `<`, `>` ve `&` gibi karakterlerin kaçışlanmasını sağlamak istiyorsanız.

Çoğu modern API için standart `c.JSON()` yeterlidir çünkü geçerli UTF-8 çıktısı verir. `AsciiJSON`'u yalnızca ASCII güvenliği belirli bir gereklilik olduğunda kullanın.

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

Bu uç noktayı curl ile test edebilirsiniz:

```bash
curl http://localhost:8080/someJSON
# Output: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

Çince karakterler `语言`'ın `\u8bed\u8a00` ile değiştirildiğine ve `<br>` etiketinin `\u003cbr\u003e` olduğuna dikkat edin. Yanıt gövdesi, herhangi bir yalnızca ASCII ortamında tüketilmek için güvenlidir.
