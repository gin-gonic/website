---
title: "JSONP"
sidebar:
  order: 3
---

JSONP (JSON with Padding), CORS desteği öncesi tarayıcılardan çapraz alan istekleri yapmak için kullanılan bir tekniktir. Bir JSON yanıtını bir JavaScript fonksiyon çağrısıyla sarmalayarak çalışır. Tarayıcı yanıtı, aynı köken politikasına tabi olmayan bir `<script>` etiketi aracılığıyla yükler ve sarmalayan fonksiyon veri argümanıyla çalışır.

`c.JSONP()` çağırdığınızda, Gin bir `callback` sorgu parametresi arar. Mevcutsa, yanıt gövdesi `callbackName({"foo":"bar"})` şeklinde sarmalanır ve `Content-Type` `application/javascript` olarak ayarlanır. Callback sağlanmadıysa, yanıt standart bir `c.JSON()` çağrısı gibi davranır.

:::note
JSONP eski bir tekniktir. Modern uygulamalar için bunun yerine [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) kullanın. CORS daha güvenlidir, tüm HTTP metodlarını destekler (sadece GET değil) ve yanıtları callback'lerle sarmalamayı gerektirmez. JSONP'yi yalnızca çok eski tarayıcıları desteklemeniz veya bunu gerektiren üçüncü taraf sistemlerle entegrasyon yapmanız gerektiğinde kullanın.
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

JSONP ve düz JSON yanıtları arasındaki farkı görmek için curl ile test edin:

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[Güvenlik hususları]
JSONP uç noktaları, callback parametresi düzgün şekilde temizlenmezse XSS saldırılarına karşı savunmasız olabilir. `alert(document.cookie)//` gibi kötü niyetli bir callback değeri rastgele JavaScript enjekte edebilir. Gin, enjeksiyon için kullanılabilecek karakterleri kaldırarak callback adını temizleyerek bunu azaltır. Ancak yine de JSONP uç noktalarını hassas olmayan, salt okunur verilerle sınırlamalısınız, çünkü web'deki herhangi bir sayfa JSONP uç noktanızı bir `<script>` etiketi aracılığıyla yükleyebilir.
:::

## Ayrıca bakınız

- [XML/JSON/YAML/ProtoBuf işleme](/tr/docs/rendering/rendering/)
- [SecureJSON](/tr/docs/rendering/secure-json/)
- [AsciiJSON](/tr/docs/rendering/ascii-json/)
- [PureJSON](/tr/docs/rendering/pure-json/)
