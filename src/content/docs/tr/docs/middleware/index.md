---
title: "Ara Katman (Middleware)"
sidebar:
  order: 6
---

Gin'de ara katman, HTTP isteklerini rota işleyicilerine ulaşmadan önce işlemek için bir yol sağlar. Bir ara katman fonksiyonu, rota işleyicisi ile aynı imzaya sahiptir -- `gin.HandlerFunc` -- ve genellikle zincirdeki bir sonraki işleyiciye kontrolü geçirmek için `c.Next()` çağırır.

## Ara katman nasıl çalışır

Gin, ara katman yürütmesi için bir **soğan modeli** kullanır. Her ara katman iki aşamada çalışır:

1. **İşleyici öncesi** -- `c.Next()` öncesindeki kod, rota işleyicisinden önce çalışır.
2. **İşleyici sonrası** -- `c.Next()` sonrasındaki kod, rota işleyicisi döndükten sonra çalışır.

Bu, ara katmanın işleyiciyi bir soğanın katmanları gibi sardığı anlamına gelir. Eklenen ilk ara katman en dıştaki katmandır.

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## Ara katman ekleme

Gin'de ara katman eklemenin üç yolu vardır:

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

Daha geniş kapsamda eklenen ara katman önce çalışır. Yukarıdaki örnekte, `GET /v1/users` isteği `Logger`, ardından `Recovery`, ardından `AuthRequired` ve son olarak `listUsers`'ı yürütür.

## Bu bölümde

- [**Ara katman kullanımı**](./using-middleware/) -- Ara katmanı global olarak, gruplara veya bireysel rotalara ekleme
- [**Özel ara katman**](./custom-middleware/) -- Kendi ara katman fonksiyonlarınızı yazma
- [**BasicAuth ara katmanı kullanımı**](./using-basicauth/) -- HTTP Temel Kimlik Doğrulama
- [**Ara katmanda goroutine'ler**](./goroutines-inside-middleware/) -- Ara katmandan güvenli şekilde arka plan görevleri çalıştırma
- [**Özel HTTP yapılandırması**](./custom-http-config/) -- Ara katmanda hata işleme ve kurtarma
- [**Güvenlik başlıkları**](./security-headers/) -- Yaygın güvenlik başlıklarını ayarlama
