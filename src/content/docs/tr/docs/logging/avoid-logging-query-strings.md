---
title: "Sorgu dizelerini loglamaktan kaçınma"
sidebar:
  order: 5
---

Sorgu dizeleri genellikle API tokenları, şifreler, oturum kimlikleri veya kişisel tanımlayıcı bilgiler (PII) gibi hassas bilgiler içerir. Bu değerleri loglamak güvenlik riskleri oluşturabilir ve GDPR veya HIPAA gibi gizlilik düzenlemelerini ihlal edebilir. Sorgu dizelerini loglarınızdan çıkararak, hassas verilerin log dosyaları, izleme sistemleri veya hata raporlama araçları aracılığıyla sızma olasılığını azaltırsınız.

Sorgu dizelerinin loglarda görünmesini engellemek için `LoggerConfig`'deki `SkipQueryString` seçeneğini kullanın. Etkinleştirildiğinde, `/path?token=secret&user=alice` isteği basitçe `/path` olarak loglanacaktır.

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

Farkı `curl` ile test edebilirsiniz:

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

`SkipQueryString` olmadan, log girişi tam sorgu dizesini içerir:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

`SkipQueryString: true` ile, sorgu dizesi çıkarılır:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

Bu, log çıktısının üçüncü taraf hizmetlere iletildiği veya uzun süre saklandığı uyumluluk açısından hassas ortamlarda özellikle faydalıdır. Uygulamanız `c.Query()` aracılığıyla sorgu parametrelerine tam erişime sahiptir -- yalnızca log çıktısı etkilenir.
